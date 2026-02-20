
import React from 'react';

export interface SceneObjectData {
    id: string;
    type: 'sphere' | 'box' | 'plane' | 'cylinder';
    name: string;
}

interface EditorSidebarProps {
    objects: SceneObjectData[];
    onAddObject: (type: SceneObjectData['type']) => void;
    onRemoveObject: (id: string) => void;
    onClearScene: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
    objects,
    onAddObject,
    onRemoveObject,
    onClearScene
}) => {
    return (
        <div className="absolute top-4 left-4 z-10 w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 flex flex-col gap-4 text-slate-100 shadow-xl max-h-[80vh] overflow-y-auto">
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Add Objects</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onAddObject('sphere')}
                        className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-violet-600 rounded-lg border border-slate-700 transition-colors text-sm"
                    >
                        ⚪ Sphere
                    </button>
                    <button
                        onClick={() => onAddObject('box')}
                        className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-pink-600 rounded-lg border border-slate-700 transition-colors text-sm"
                    >
                        ⬜ Box
                    </button>
                    <button
                        onClick={() => onAddObject('cylinder')}
                        className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-blue-600 rounded-lg border border-slate-700 transition-colors text-sm"
                    >
                        cyl Cylinder
                    </button>
                    <button
                        onClick={() => onAddObject('plane')}
                        className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-emerald-600 rounded-lg border border-slate-700 transition-colors text-sm"
                    >
                        ⬛ Plane
                    </button>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Scene Graph</h3>
                    <span className="text-xs text-slate-500">{objects.length} objects</span>
                </div>

                <div className="space-y-2">
                    {objects.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                            Scene is empty
                        </div>
                    ) : (
                        objects.map((obj) => (
                            <div
                                key={obj.id}
                                className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 group hover:border-violet-500/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-xs text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                                        {obj.type.slice(0, 3)}
                                    </span>
                                    <span className="text-sm truncate">{obj.name}</span>
                                </div>
                                <button
                                    onClick={() => onRemoveObject(obj.id)}
                                    className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove object"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="pt-3 border-t border-slate-700">
                <button
                    onClick={onClearScene}
                    className="w-full py-2 bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 hover:border-red-900/50 transition-colors text-sm font-medium"
                >
                    Clear Scene
                </button>
            </div>

            {/* Instructions */}
            <div className="mt-2 p-3 bg-violet-900/10 border border-violet-500/20 rounded-lg">
                <h4 className="text-xs font-bold text-violet-300 mb-1">💡 Pro Tips</h4>
                <ul className="text-[10px] text-violet-200/70 space-y-1">
                    <li>• Select objects in the viewport to move them.</li>
                    <li>• Use the Theatre.js panel (right) to animate properties.</li>
                    <li>• "Save to Database" saves both objects and animation.</li>
                </ul>
            </div>
        </div>
    );
};
