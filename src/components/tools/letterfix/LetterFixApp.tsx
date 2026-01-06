"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AppState, EditableField, AnalyzedField } from "./types";
import { analyzeImage, generateImage } from "./aiService";
import { Upload, Wand2, RefreshCw, Sparkles, Download, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LetterFixApp: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editedData, setEditedData] = useState<EditableField[] | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const revokePreviewUrl = useCallback((preview: string | null) => {
        if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
    }, []);

    useEffect(() => {
        return () => {
            revokePreviewUrl(imagePreview);
        };
    }, [imagePreview, revokePreviewUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            revokePreviewUrl(imagePreview);
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setAppState(AppState.IMAGE_UPLOADED);
            setError(null);
            setGeneratedImage(null);
            setEditedData(null);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) return;
        setAppState(AppState.ANALYZING);
        setError(null);
        try {
            const data: AnalyzedField[] = await analyzeImage(imageFile);
            const editableFields: EditableField[] = data.map((field, index) => ({
                id: index,
                label: field.label,
                value: field.value,
                originalValue: field.value,
            }));
            setEditedData(editableFields);
            setAppState(AppState.EDITING);
        } catch (err) {
            setError((err as Error).message);
            setAppState(AppState.ERROR);
        }
    }, [imageFile]);

    const handleGenerate = async () => {
        if (!editedData || !imageFile) return;
        setAppState(AppState.GENERATING);
        setError(null);
        try {
            const newImage = await generateImage(editedData, imageFile);
            setGeneratedImage(newImage);
            setAppState(AppState.RESULT);
        } catch (err) {
            setError((err as Error).message);
            setAppState(AppState.ERROR);
        }
    };

    const handleReset = () => {
        revokePreviewUrl(imagePreview);
        setAppState(AppState.INITIAL);
        setImageFile(null);
        setImagePreview(null);
        setEditedData(null);
        setGeneratedImage(null);
        setError(null);
    };

    const handleInputChange = (id: number, value: string) => {
        if (!editedData) return;
        setEditedData(
            editedData.map((field) =>
                field.id === id ? { ...field, value } : field
            )
        );
    };

    const renderFileUpload = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <label
                htmlFor="file-upload"
                className="relative block w-full p-12 text-center border-2 border-dashed rounded-3xl cursor-pointer border-white/20 hover:border-[#00D9FF] hover:bg-[#00D9FF]/5 transition-all duration-300 group"
            >
                <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6 group-hover:bg-[#00D9FF]/10 group-hover:text-[#00D9FF]">
                    <Upload className="w-8 h-8 text-white/60 group-hover:text-[#00D9FF]" />
                </div>
                <span className="mt-4 block text-xl font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                    Carregue sua arte final
                </span>
                <span className="mt-2 block text-sm text-white/40 max-w-sm mx-auto">
                    Embalagens, bulas, rótulos — PNG, JPG, WEBP para melhores resultados (até 5MB).
                </span>
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </label>
        </motion.div>
    );

    const renderEditor = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto"
        >
            {/* Original Image */}
            <div className="glass-card rounded-3xl p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Upload size={20} className="text-[#00D9FF]" />
                        Original
                    </h3>
                    <button
                        onClick={handleReset}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                    >
                        Trocar imagem
                    </button>
                </div>

                <div className="flex-1 bg-black/50 rounded-2xl overflow-hidden flex justify-center items-center min-h-[300px] border border-white/5 relative group">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            className="object-contain max-h-[500px] w-auto"
                        />
                    ) : (
                        <p className="text-white/40">Nenhuma imagem carregada.</p>
                    )}
                </div>

                {appState === AppState.IMAGE_UPLOADED && (
                    <div className="mt-6 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-medium"
                        >
                            <Wand2 className="w-5 h-5" />
                            Analisar Textos com IA
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Editor Panel */}
            <div className="glass-card rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D9FF] to-[#0A1628]" />
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles size={20} className="text-[#10B981]" />
                    Editor
                </h3>

                {appState === AppState.ANALYZING ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-20">
                        <Loader2 className="w-12 h-12 text-[#00D9FF] animate-spin mb-6" />
                        <p className="text-white font-medium text-lg">Identificando textos...</p>
                        <p className="text-white/40 text-sm mt-2">Nossa IA está lendo sua imagem pixel a pixel.</p>
                    </div>
                ) : editedData ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleGenerate();
                        }}
                        className="flex flex-col h-full"
                    >
                        <p className="text-sm text-white/60 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                            ✏️ Edite os textos abaixo. A IA irá substituir o conteúdo mantendo a fonte, cor e perspectiva originais.
                        </p>

                        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar flex-1">
                            {editedData.map((field) => (
                                <div key={field.id} className="group">
                                    <label
                                        htmlFor={`field-${field.id}`}
                                        className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5"
                                    >
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name={`field-${field.id}`}
                                            id={`field-${field.id}`}
                                            value={field.value}
                                            onChange={(e) =>
                                                handleInputChange(field.id, e.target.value)
                                            }
                                            className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all placeholder-white/20"
                                            placeholder={field.originalValue}
                                        />
                                        {field.value !== field.originalValue && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#10B981] rounded-full" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-white/20 mt-1 truncate">
                                        Original: {field.originalValue}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-medium shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)] transition-shadow"
                            >
                                <Sparkles className="w-5 h-5" />
                                Gerar Nova Versão
                            </motion.button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-20 opacity-50">
                        <Wand2 className="w-16 h-16 mb-4 text-white/20" />
                        <p className="text-white/40">Faça upload e analise para editar</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderResult = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="glass-card rounded-3xl p-1 overflow-hidden">
                <div className="bg-[#0A1628]/80 p-8 rounded-[22px]">
                    <div className="text-center mb-8">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-sm font-bold mb-4 border border-[#10B981]/20">
                            ✨ Sucesso!
                        </span>
                        <h3 className="text-3xl font-bold text-white">Arte Pronta</h3>
                    </div>

                    {appState === AppState.GENERATING ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-[#00D9FF]/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-[#00D9FF] rounded-full border-t-transparent animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto text-[#00D9FF] animate-pulse" size={32} />
                            </div>
                            <p className="text-xl font-bold text-white mb-2">Preservando texturas...</p>
                            <p className="text-white/40">Inpainting pixel-perfect em andamento com Imagen 3</p>
                        </div>
                    ) : generatedImage && (
                        <div className="space-y-8">
                            <div className="bg-black/50 rounded-2xl overflow-hidden flex justify-center items-center relative border border-white/10 group">
                                <div className="absolute inset-0 bg-[url('/images/transparent-bg.png')] opacity-10"></div>
                                <img
                                    src={generatedImage}
                                    alt="Generated result"
                                    className="relative z-10 object-contain max-h-[70vh] w-auto shadow-2xl"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href={generatedImage}
                                    download="astrivia-letterfix.png"
                                    className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2 font-medium"
                                >
                                    <Download className="w-5 h-5" />
                                    Baixar Arte Final
                                </a>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-4 rounded-xl flex items-center gap-2 font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Criar Nova
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="w-full">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-start gap-3 mb-8 max-w-2xl mx-auto"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-bold block mb-1">Ocorreu um erro</strong>
                        <span className="text-sm opacity-90">{error}</span>
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {appState === AppState.INITIAL && (
                    <motion.div key="upload" exit={{ opacity: 0, y: -20 }}>
                        {renderFileUpload()}
                    </motion.div>
                )}
                {[AppState.IMAGE_UPLOADED, AppState.ANALYZING, AppState.EDITING].includes(appState) && (
                    <motion.div key="editor" exit={{ opacity: 0, y: -20 }}>
                        {renderEditor()}
                    </motion.div>
                )}
                {[AppState.GENERATING, AppState.RESULT].includes(appState) && (
                    <motion.div key="result" exit={{ opacity: 0, y: -20 }}>
                        {renderResult()}
                    </motion.div>
                )}
                {appState === AppState.ERROR && (
                    <motion.div key="error">
                        {(imagePreview && !generatedImage) ? renderEditor() : renderResult()}
                        <div className="text-center mt-8">
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center px-6 py-3 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reiniciar sessão
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LetterFixApp;
