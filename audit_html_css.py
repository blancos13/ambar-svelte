#!/usr/bin/env python3
"""Static HTML/CSS baseline audit for the human-perception skill.

This script is intentionally dependency-free. It does not render a page; it flags
common source-level issues that often create visible design problems.
"""

from __future__ import annotations

import argparse
import html.parser
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


@dataclass
class Issue:
    element: str
    issue_type: str
    severity: str
    fix: str


class ElementCollector(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.elements: list[tuple[str, dict[str, str]]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.elements.append((tag.lower(), {k.lower(): v or "" for k, v in attrs}))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def read_text(path: Path | None) -> str:
    if not path:
        return ""
    return path.read_text(encoding="utf-8", errors="replace")


def collect_inline_css(elements: Iterable[tuple[str, dict[str, str]]]) -> str:
    return "\n".join(attrs.get("style", "") for _, attrs in elements if attrs.get("style"))


def selector_for(tag: str, attrs: dict[str, str]) -> str:
    if attrs.get("id"):
        return f"#{attrs['id']}"
    if attrs.get("class"):
        first_class = attrs["class"].split()[0]
        return f"{tag}.{first_class}"
    return tag


def audit_html(elements: list[tuple[str, dict[str, str]]]) -> list[Issue]:
    issues: list[Issue] = []
    for tag, attrs in elements:
        selector = selector_for(tag, attrs)
        if tag == "img":
            if not attrs.get("width") or not attrs.get("height"):
                issues.append(Issue(selector, "sharpness/layout-shift", "🔴", "add explicit width and height attributes that match the intrinsic image ratio"))
            if not attrs.get("alt"):
                issues.append(Issue(selector, "accessibility", "🟡", "add meaningful alt text, or alt=\"\" for decorative images"))
        if tag == "svg" and not attrs.get("viewbox"):
            issues.append(Issue(selector, "sharpness/responsiveness", "🔴", "add a viewBox attribute so the svg scales crisply"))
        style = attrs.get("style", "")
        if re.search(r"(?:left|right|top|bottom|width|height|margin|padding):\s*\d+\.\d+px", style):
            issues.append(Issue(selector, "alignment", "🔴", "round sub-pixel px values to whole pixels or use layout primitives"))
    return issues


def audit_css(css: str) -> list[Issue]:
    issues: list[Issue] = []
    if css and "box-sizing" not in css:
        issues.append(Issue("global", "box-model", "🔴", "add *, *::before, *::after { box-sizing: border-box; }"))
    if css and not re.search(r"img\s*\{[^}]*max-width\s*:\s*100%", css, re.DOTALL):
        issues.append(Issue("img", "responsiveness", "🟡", "add img { max-width: 100%; height: auto; }"))

    for match in re.finditer(r"font-size\s*:\s*([0-9.]+)px", css):
        value = float(match.group(1))
        if value < 12:
            issues.append(Issue("css font-size", "typography", "🔴", f"increase {value:g}px body/supporting text to at least 12px, preferably 14px+"))

    for match in re.finditer(r"line-height\s*:\s*([0-9.]+)(?!px|rem|em|%)", css):
        value = float(match.group(1))
        if value < 1.4:
            issues.append(Issue("css line-height", "typography", "🟡", f"raise line-height from {value:g} to at least 1.4 for paragraph text"))

    for match in re.finditer(r"box-shadow\s*:\s*([^;}]*)", css):
        px_values = [float(v) for v in re.findall(r"(-?\d+(?:\.\d+)?)px", match.group(1))]
        if len(px_values) >= 3 and abs(px_values[2]) > 20:
            issues.append(Issue("css box-shadow", "sharpness", "🟡", "reduce shadow blur on small elements or use a subtler elevation scale"))

    for match in re.finditer(r"(?:left|right|top|bottom|width|height|margin|padding)\s*:\s*\d+\.\d+px", css):
        issues.append(Issue("css positioning", "alignment", "🔴", f"avoid sub-pixel value `{match.group(0)}` unless it is intentional"))

    return issues


def markdown_table(issues: list[Issue]) -> str:
    if not issues:
        return "No obvious static issues found. Continue with visual/perception review."
    lines = [
        "| Element | Issue Type | Severity | Fix Summary |",
        "|---|---|---:|---|",
    ]
    for issue in issues:
        lines.append(f"| {issue.element} | {issue.issue_type} | {issue.severity} | {issue.fix} |")
    critical = sum(1 for i in issues if i.severity == "🔴")
    warning = sum(1 for i in issues if i.severity == "🟡")
    return "\n".join(lines) + f"\n\nTotal: {critical} 🔴 Critical | {warning} 🟡 Warning"


def main() -> int:
    parser = argparse.ArgumentParser(description="Run a static HTML/CSS design audit.")
    parser.add_argument("html", type=Path, help="HTML file to inspect")
    parser.add_argument("--css", type=Path, action="append", default=[], help="CSS file to include; may be used multiple times")
    args = parser.parse_args()

    html_text = read_text(args.html)
    collector = ElementCollector()
    collector.feed(html_text)

    css_text = "\n".join(read_text(path) for path in args.css)
    css_text += "\n" + collect_inline_css(collector.elements)

    issues = audit_html(collector.elements) + audit_css(css_text)
    print(markdown_table(issues))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
