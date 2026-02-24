"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const MAX_HISTORY = 50;
const GRID_SIZE = 20;
const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;

const FONT_FAMILIES = [
  "system-ui",
  "Arial",
  "Georgia",
  "Courier New",
  "Verdana",
  "Impact",
  "Comic Sans MS",
];
const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

const getLabel = (obj: any, idx: number) => {
  const map: Record<string, string> = {
    rect: "Rectangle",
    circle: "Circle",
    textbox: "Text",
    "i-text": "Text",
    line: "Line",
    group: "Arrow",
    image: "Image",
    triangle: "Triangle",
  };
  return `${map[obj.type] ?? obj.type} ${idx + 1}`;
};

// Shared button classes
const BTN =
  "px-3 py-1.5 text-sm font-medium text-white rounded disabled:opacity-40";

const FabricEditor: React.FC = () => {
  const canvasRef = useRef<any>(null);
  const fabricRef = useRef<any>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef<number>(-1);
  const pauseHistRef = useRef(false);
  const snapRef = useRef(false);

  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [fillColor, setFillColor] = useState("#3b82f6");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [layers, setLayers] = useState<any[]>([]);
  const [props, setProps] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    opacity: 100,
    angle: 0,
  });
  const [textProps, setTextProps] = useState({
    fontSize: 20,
    fontFamily: "system-ui",
    bold: false,
    italic: false,
    underline: false,
  });
  const [isTextObj, setIsTextObj] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [snap, setSnap] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const getFabricClasses = (mod: any) => {
    const ns = mod.fabric ?? mod;
    return {
      Canvas: ns.Canvas,
      Rect: ns.Rect,
      Circle: ns.Circle,
      Textbox: ns.Textbox,
      Line: ns.Line,
      Triangle: ns.Triangle,
      Group: ns.Group,
      Image: ns.Image,
    };
  };

  const syncLayers = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setLayers([...canvas.getObjects()].reverse());
  }, []);

  const syncProps = useCallback((obj: any) => {
    if (!obj) return;
    setProps({
      x: Math.round(obj.left ?? 0),
      y: Math.round(obj.top ?? 0),
      w: Math.round((obj.width ?? 0) * (obj.scaleX ?? 1)),
      h: Math.round((obj.height ?? 0) * (obj.scaleY ?? 1)),
      opacity: Math.round((obj.opacity ?? 1) * 100),
      angle: Math.round(obj.angle ?? 0),
    });
    const isText = obj.type === "textbox" || obj.type === "i-text";
    setIsTextObj(isText);
    if (isText) {
      setTextProps({
        fontSize: obj.fontSize ?? 20,
        fontFamily: obj.fontFamily ?? "system-ui",
        bold: obj.fontWeight === "bold",
        italic: obj.fontStyle === "italic",
        underline: obj.underline ?? false,
      });
    }
    setFillColor(obj.fill || "#3b82f6");
    setStrokeColor(obj.stroke || "#000000");
    setStrokeWidth(obj.strokeWidth ?? 0);
  }, []);

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || pauseHistRef.current) return;
    const json = JSON.stringify(canvas.toJSON());
    const hist = historyRef.current;
    const idx = historyIdxRef.current;
    hist.splice(idx + 1);
    hist.push(json);
    if (hist.length > MAX_HISTORY) hist.shift();
    historyIdxRef.current = hist.length - 1;
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
  }, []);

  const applyHistory = useCallback(
    (json: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      pauseHistRef.current = true;
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
        syncLayers();
        setSelectedObject(null);
        pauseHistRef.current = false;
      });
    },
    [syncLayers],
  );

  const undo = useCallback(() => {
    const idx = historyIdxRef.current;
    if (idx <= 0) return;
    historyIdxRef.current = idx - 1;
    applyHistory(historyRef.current[historyIdxRef.current]);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(true);
  }, [applyHistory]);

  const redo = useCallback(() => {
    const hist = historyRef.current;
    const idx = historyIdxRef.current;
    if (idx >= hist.length - 1) return;
    historyIdxRef.current = idx + 1;
    applyHistory(hist[historyIdxRef.current]);
    setCanUndo(true);
    setCanRedo(historyIdxRef.current < hist.length - 1);
  }, [applyHistory]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (ctrl && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      )
        deleteSelected();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const snapValue = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

  useEffect(() => {
    let mounted = true;
    const initCanvas = async () => {
      if (!canvasElRef.current) return;
      let mod: any;
      try {
        mod = await import("fabric");
      } catch (e) {
        console.error(e);
        return;
      }
      const { Canvas } = getFabricClasses(mod);
      if (!Canvas || !mounted) return;
      fabricRef.current = mod;
      const canvas = new Canvas(canvasElRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#ffffff",
        selection: true,
      });
      canvasRef.current = canvas;
      const onSelect = () => {
        const obj = canvas.getActiveObject();
        setSelectedObject(obj || null);
        if (obj) syncProps(obj);
      };
      canvas.on("selection:created", onSelect);
      canvas.on("selection:updated", onSelect);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        setIsTextObj(false);
      });
      canvas.on("object:moving", (e: any) => {
        if (snapRef.current)
          e.target.set({
            left: snapValue(e.target.left),
            top: snapValue(e.target.top),
          });
        syncProps(e.target);
      });
      canvas.on("object:scaling", (e: any) => syncProps(e.target));
      canvas.on("object:rotating", (e: any) => syncProps(e.target));
      canvas.on("object:modified", () => {
        syncLayers();
        pushHistory();
      });
      canvas.on("object:added", () => {
        syncLayers();
        pushHistory();
      });
      canvas.on("object:removed", () => {
        syncLayers();
        pushHistory();
      });
      canvas.renderAll();
      historyRef.current = [JSON.stringify(canvas.toJSON())];
      historyIdxRef.current = 0;
      setReady(true);
    };
    void initCanvas();
    return () => {
      mounted = false;
      if (canvasRef.current) {
        try {
          canvasRef.current.dispose();
        } catch (_) {}
        canvasRef.current = null;
      }
    };
  }, [syncLayers, syncProps, pushHistory]);

  const applyZoom = useCallback((newZoom: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, newZoom));
    canvas.setZoom(clamped);
    canvas.setWidth(CANVAS_WIDTH * clamped);
    canvas.setHeight(CANVAS_HEIGHT * clamped);
    canvas.renderAll();
    setZoom(clamped);
  }, []);
  const zoomIn = () => applyZoom(zoom + ZOOM_STEP);
  const zoomOut = () => applyZoom(zoom - ZOOM_STEP);
  const zoomReset = () => applyZoom(1);
  const toggleSnap = () => {
    const next = !snap;
    setSnap(next);
    snapRef.current = next;
  };

  const addRectangle = () => {
    const canvas = canvasRef.current;
    const mod = fabricRef.current;
    if (!canvas || !mod) return;
    const { Rect } = getFabricClasses(mod);
    const obj = new Rect({
      left: CANVAS_WIDTH / 2 - 60,
      top: CANVAS_HEIGHT / 2 - 30,
      width: 120,
      height: 60,
      fill: "#3b82f6",
      rx: 8,
      ry: 8,
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };
  const addCircle = () => {
    const canvas = canvasRef.current;
    const mod = fabricRef.current;
    if (!canvas || !mod) return;
    const { Circle } = getFabricClasses(mod);
    const obj = new Circle({
      left: CANVAS_WIDTH / 2 - 40,
      top: CANVAS_HEIGHT / 2 - 40,
      radius: 40,
      fill: "#ec4899",
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };
  const addText = () => {
    const canvas = canvasRef.current;
    const mod = fabricRef.current;
    if (!canvas || !mod) return;
    const { Textbox } = getFabricClasses(mod);
    const obj = new Textbox("Text", {
      left: CANVAS_WIDTH / 2 - 80,
      top: CANVAS_HEIGHT / 2 - 20,
      width: 160,
      fontSize: 20,
      fill: "#000000",
      editable: true,
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };
  const addLine = () => {
    const canvas = canvasRef.current;
    const mod = fabricRef.current;
    if (!canvas || !mod) return;
    const { Line } = getFabricClasses(mod);
    const obj = new Line(
      [
        CANVAS_WIDTH / 2 - 80,
        CANVAS_HEIGHT / 2,
        CANVAS_WIDTH / 2 + 80,
        CANVAS_HEIGHT / 2,
      ],
      { stroke: "#374151", strokeWidth: 2 },
    );
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };
  const addArrow = () => {
    const canvas = canvasRef.current;
    const mod = fabricRef.current;
    if (!canvas || !mod) return;
    const { Line, Triangle, Group } = getFabricClasses(mod);
    const sx = CANVAS_WIDTH / 2 - 80,
      ex = CANVAS_WIDTH / 2 + 80,
      y = CANVAS_HEIGHT / 2;
    const line = new Line([sx, y, ex, y], {
      stroke: "#d97706",
      strokeWidth: 3,
    });
    const head = new Triangle({
      left: ex - 8,
      top: y - 8,
      width: 16,
      height: 16,
      fill: "#d97706",
      angle: 90,
    });
    const arrow = new Group([line, head], {
      selectable: true,
      objectCaching: false,
    });
    canvas.add(arrow);
    canvas.setActiveObject(arrow);
    canvas.renderAll();
  };
  const triggerImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
      imageInputRef.current.click();
    }
  };
  const handleImageSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const canvas = canvasRef.current;
    const mod = fabricRef.current;
    if (!canvas || !mod) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") return;
      const { Image } = getFabricClasses(mod);
      try {
        const img = await Image.fromURL(dataUrl);
        if (!img) return;
        img.set({
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: "center",
          originY: "center",
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const changeFill = (color: string) => {
    setFillColor(color);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject() as any;
    if (!active) return;
    if (active.type === "line") active.set({ stroke: color });
    else if (active.type === "group")
      (active._objects || active.getObjects?.() || []).forEach((o: any) => {
        if (o.type === "line") o.set({ stroke: color });
        else o.set({ fill: color });
      });
    else active.set({ fill: color });
    canvas.renderAll();
    pushHistory();
  };
  const changeStrokeColor = (color: string) => {
    setStrokeColor(color);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject() as any;
    if (!active) return;
    active.set({ stroke: color });
    canvas.renderAll();
    pushHistory();
  };
  const changeStrokeWidth = (w: number) => {
    setStrokeWidth(w);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject() as any;
    if (!active) return;
    active.set({ strokeWidth: w });
    canvas.renderAll();
    pushHistory();
  };
  const applyTextProp = (patch: Partial<typeof textProps>) => {
    const next = { ...textProps, ...patch };
    setTextProps(next);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject() as any;
    if (!active) return;
    if (patch.fontSize !== undefined) active.set({ fontSize: patch.fontSize });
    if (patch.fontFamily !== undefined)
      active.set({ fontFamily: patch.fontFamily });
    if (patch.bold !== undefined)
      active.set({ fontWeight: patch.bold ? "bold" : "normal" });
    if (patch.italic !== undefined)
      active.set({ fontStyle: patch.italic ? "italic" : "normal" });
    if (patch.underline !== undefined)
      active.set({ underline: patch.underline });
    canvas.renderAll();
    pushHistory();
  };

  const deleteSelected = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.remove(active);
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
  };
  const deleteAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
    setSelectedObject(null);
    pushHistory();
  };
  const duplicateSelected = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const cloned = await active.clone();
    cloned.set({ left: (active.left || 0) + 20, top: (active.top || 0) + 20 });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
  };

  const selectLayer = (obj: any) => {
    const c = canvasRef.current;
    if (!c) return;
    c.setActiveObject(obj);
    c.renderAll();
    setSelectedObject(obj);
    syncProps(obj);
  };
  const moveLayerUp = (obj: any) => {
    const c = canvasRef.current;
    if (!c) return;
    c.bringForward(obj);
    syncLayers();
    pushHistory();
  };
  const moveLayerDown = (obj: any) => {
    const c = canvasRef.current;
    if (!c) return;
    c.sendBackwards(obj);
    syncLayers();
    pushHistory();
  };
  const toggleVisible = (obj: any) => {
    obj.set({ visible: !obj.visible });
    canvasRef.current?.renderAll();
    syncLayers();
  };

  const applyProp = (key: string, raw: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject() as any;
    if (!active) return;
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    if (key === "x") active.set({ left: val });
    else if (key === "y") active.set({ top: val });
    else if (key === "w") active.scaleToWidth(val);
    else if (key === "h") active.scaleToHeight(val);
    else if (key === "opacity") active.set({ opacity: val / 100 });
    else if (key === "angle") active.set({ angle: val });
    active.setCoords();
    canvas.renderAll();
    setProps((p) => ({ ...p, [key]: val }));
    pushHistory();
  };

  const exportJSON = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = new Blob([JSON.stringify(canvas.toJSON(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);
    canvas.setWidth(CANVAS_WIDTH);
    canvas.setHeight(CANVAS_HEIGHT);
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "canvas.png";
    a.click();
    canvas.setZoom(currentZoom);
    canvas.setWidth(CANVAS_WIDTH * currentZoom);
    canvas.setHeight(CANVAS_HEIGHT * currentZoom);
    canvas.renderAll();
  };
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      setSaving(true);
      const res = await fetch("/api/animations2d/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "2D Animation",
          description: "",
          config: {
            canvasJSON: canvas.toJSON(),
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          },
        }),
      });
      const data = await res.json();
      setSavedId(data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const propFields = [
    { key: "x", label: "X" },
    { key: "y", label: "Y" },
    { key: "w", label: "W" },
    { key: "h", label: "H" },
    { key: "angle", label: "°" },
    { key: "opacity", label: "%" },
  ];
  const presetColors = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#facc15",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];

  return (
    <div className="w-full space-y-3">
      {!ready && (
        <p className="text-sm text-gray-400 animate-pulse">
          Initializing canvas…
        </p>
      )}

      {/* ── Toolbar ── */}
      <div className="flex gap-2 flex-wrap items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <span className="text-sm font-medium text-gray-300 mr-1">Add:</span>
        {[
          { label: "+ Rect", fn: addRectangle, cls: "bg-blue-600" },
          { label: "+ Circle", fn: addCircle, cls: "bg-pink-600" },
          { label: "+ Text", fn: addText, cls: "bg-purple-600" },
          { label: "+ Line", fn: addLine, cls: "bg-gray-600" },
          { label: "+ Arrow", fn: addArrow, cls: "bg-yellow-600" },
          { label: "+ Image", fn: triggerImageUpload, cls: "bg-emerald-600" },
        ].map(({ label, fn, cls }) => (
          <button
            key={label}
            onClick={fn}
            disabled={!ready}
            className={`${BTN} ${cls}`}
          >
            {label}
          </button>
        ))}

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={undo}
          disabled={!canUndo}
          title="Ctrl+Z"
          className={`${BTN} bg-gray-700`}
        >
          ↩ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Ctrl+Y"
          className={`${BTN} bg-gray-700`}
        >
          ↪ Redo
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={zoomOut}
          disabled={!ready}
          className={`${BTN} bg-gray-700`}
        >
          −
        </button>
        <span className="text-sm font-medium text-gray-200 w-14 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={zoomIn}
          disabled={!ready}
          className={`${BTN} bg-gray-700`}
        >
          +
        </button>
        <button
          onClick={zoomReset}
          disabled={!ready}
          className={`${BTN} bg-gray-700`}
        >
          Reset
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={toggleSnap}
          disabled={!ready}
          className={`${BTN} ${snap ? "bg-blue-600" : "bg-gray-700"}`}
        >
          ⊞ Snap {snap ? "ON" : "OFF"}
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={duplicateSelected}
          disabled={!ready || !selectedObject}
          className={`${BTN} bg-indigo-600`}
        >
          Duplicate
        </button>
        <button
          onClick={deleteSelected}
          disabled={!ready || !selectedObject}
          className={`${BTN} bg-red-600`}
        >
          Delete
        </button>
        <button
          onClick={deleteAll}
          disabled={!ready}
          className={`${BTN} bg-red-900`}
        >
          Clear All
        </button>
      </div>

      {/* ── Main area ── */}
      <div className="flex gap-3 items-start">
        {/* Canvas */}
        <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-auto">
          <canvas ref={canvasElRef} />
        </div>

        {/* Right panels */}
        <div className="w-56 flex flex-col gap-3 shrink-0">
          {/* Properties */}
          {selectedObject && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-3">
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Properties
              </p>

              {/* Fill */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Fill
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => changeFill(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border border-gray-600 shrink-0"
                  />
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => changeFill(c)}
                      className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition-transform shrink-0"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Stroke
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => changeStrokeColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border border-gray-600 shrink-0"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-[10px] text-gray-400">W</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={strokeWidth}
                      onChange={(e) =>
                        changeStrokeWidth(Number(e.target.value))
                      }
                      className="w-full bg-white/10 border border-white/20 rounded px-1.5 py-1 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Text */}
              {isTextObj && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Text
                  </p>
                  <select
                    value={textProps.fontFamily}
                    onChange={(e) =>
                      applyTextProp({ fontFamily: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded px-1.5 py-1 text-xs text-white outline-none focus:border-blue-500"
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f} value={f} style={{ color: "#000" }}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 shrink-0">
                      Size
                    </span>
                    <select
                      value={textProps.fontSize}
                      onChange={(e) =>
                        applyTextProp({ fontSize: Number(e.target.value) })
                      }
                      className="flex-1 bg-white/10 border border-white/20 rounded px-1.5 py-1 text-xs text-white outline-none focus:border-blue-500"
                    >
                      {FONT_SIZES.map((s) => (
                        <option key={s} value={s} style={{ color: "#000" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={textProps.fontSize}
                      min={1}
                      max={200}
                      onChange={(e) =>
                        applyTextProp({ fontSize: Number(e.target.value) })
                      }
                      className="w-14 bg-white/10 border border-white/20 rounded px-1.5 py-1 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-1">
                    {[
                      {
                        label: "B",
                        key: "bold",
                        active: textProps.bold,
                        style: "font-bold",
                      },
                      {
                        label: "I",
                        key: "italic",
                        active: textProps.italic,
                        style: "italic",
                      },
                      {
                        label: "U",
                        key: "underline",
                        active: textProps.underline,
                        style: "underline",
                      },
                    ].map(({ label, key, active, style }) => (
                      <button
                        key={key}
                        onClick={() => applyTextProp({ [key]: !active } as any)}
                        className={`px-2.5 py-1 rounded text-xs ${style} ${active ? "bg-blue-600 text-white" : "bg-white/10 text-gray-300"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Transform */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Transform
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {propFields.map(({ key, label }) => (
                    <label key={key} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400">{label}</span>
                      <input
                        type="number"
                        value={props[key as keyof typeof props]}
                        onChange={(e) =>
                          setProps((p) => ({
                            ...p,
                            [key]: Number(e.target.value),
                          }))
                        }
                        onBlur={(e) => applyProp(key, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            applyProp(
                              key,
                              (e.target as HTMLInputElement).value,
                            );
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded px-1.5 py-1 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layers */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
              Layers
            </p>
            {layers.length === 0 && (
              <p className="text-xs text-gray-500 italic">No objects yet</p>
            )}
            {layers.map((obj, i) => {
              const isSelected = selectedObject === obj;
              return (
                <div
                  key={i}
                  onClick={() => selectLayer(obj)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors
                    ${isSelected ? "bg-blue-600/30 border border-blue-500/50" : "hover:bg-white/10 border border-transparent"}`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisible(obj);
                    }}
                    className="shrink-0 text-gray-400 hover:text-white"
                  >
                    {obj.visible === false ? "🙈" : "👁"}
                  </button>
                  <span className="flex-1 truncate text-gray-200">
                    {getLabel(obj, layers.length - 1 - i)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerUp(obj);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ▲
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerDown(obj);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ▼
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={handleSave}
          disabled={saving || !ready}
          className={`${BTN} bg-green-600`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={exportJSON}
          disabled={!ready}
          className={`${BTN} bg-gray-700`}
        >
          Export JSON
        </button>
        <button
          onClick={exportPNG}
          disabled={!ready}
          className={`${BTN} bg-gray-700`}
        >
          Export PNG
        </button>
      </div>

      {savedId && (
        <div className="text-green-400 text-sm">
          Saved ID:{" "}
          <code className="bg-black/40 px-2 py-1 rounded border border-green-700">
            {savedId}
          </code>
        </div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />
    </div>
  );
};

export default FabricEditor;
