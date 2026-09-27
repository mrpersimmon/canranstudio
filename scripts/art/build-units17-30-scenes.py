#!/usr/bin/env python3
"""Compatibility entry: redraw exactly one reviewed unit; there is no batch default."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('redraw-classroom-stages.py')), run_name='__main__')
