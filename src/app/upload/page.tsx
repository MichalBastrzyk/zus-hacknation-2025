"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import { Alert, AlertDescription } from "@/src/components/ui/alert"

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
    const [statusMessage, setStatusMessage] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile)
            setUploadStatus("idle")
            setStatusMessage("")
        } else {
            setStatusMessage("Proszę wybrać plik PDF")
            setUploadStatus("error")
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setStatusMessage("Proszę wybrać plik")
            setUploadStatus("error")
            return
        }

        setIsLoading(true)
        setStatusMessage("Przetwarzanie pliku...")

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload/pdf", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const result = await response.json()
                setStatusMessage(`Plik ${file.name} został pomyślnie przesłany i przetworzony`)
                setUploadStatus("success")
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            } else {
                const error = await response.json()
                setStatusMessage(`Błąd: ${error.message || "Nie udało się przetworzyć pliku"}`)
                setUploadStatus("error")
            }
        } catch (error) {
            console.error("Upload error:", error)
            setStatusMessage("Błąd podczas przesyłania pliku")
            setUploadStatus("error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile)
            setUploadStatus("idle")
            setStatusMessage("")
        } else {
            setStatusMessage("Proszę wybrać plik PDF")
            setUploadStatus("error")
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Przesłij PDF</h1>
                <p className="text-gray-600">Prześlij dokument PDF do przetworzenia</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Przesyłanie pliku PDF</CardTitle>
                    <CardDescription>
                        Wybierz lub przeciągnij plik PDF do obszaru poniżej
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Drag and drop area */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer block">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-lg font-semibold mb-1">Przeciągnij plik tutaj</p>
                            <p className="text-sm text-gray-500">lub kliknij aby wybrać plik PDF</p>
                        </label>
                    </div>

                    {/* Selected file info */}
                    {file && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                                <div className="flex-1">
                                    <p className="font-semibold text-blue-900">{file.name}</p>
                                    <p className="text-sm text-blue-700">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status messages */}
                    {uploadStatus === "success" && (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                {statusMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {uploadStatus === "error" && (
                        <Alert className="bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {statusMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Upload button */}
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isLoading}
                        size="lg"
                        className="w-full gap-2"
                    >
                        <Upload className="h-5 w-5" />
                        {isLoading ? "Przetwarzanie..." : "Przeslij plik"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
