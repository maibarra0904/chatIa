import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const GenerarDocumento = () => {
    const handleDownload = () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "Milagro, día de mes del año",
                            alignment: AlignmentType.RIGHT,
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24, // Tamaño de letra 11 puntos (24 en docx)
                        }),
                        new Paragraph({
                            text: "Oficio Nro. XXXX",
                            alignment: AlignmentType.RIGHT,
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Asunto: Autorización para realizar Labores Comunitarias",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Ingeniero César Morán Castro, PhD",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "DECANO",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "FACULTAD DE CIENCIAS AGRARIAS",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Ciudad. -",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "De mi consideración:",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Por medio del presente, se solicita cordialmente la autorización, para que los estudiantes en lista de la carrera COMPUTACIÓN de la Ciudad Universitaria “Dr. Jacobo Bucaram Ortiz” sede Milagro, Facultad de Ciencias Agrarias “Dr. Jacobo Bucaram Ortiz”, puedan realizar las Labores Comunitarias Estudiantiles de los períodos que se especifican a continuación:",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        
                        // Tabla de estudiantes
                        new Table({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("APELLIDOS Y NOMBRES")],
                                            width: { size: 50, type: WidthType.PERCENTAGE },
                                            verticalAlignment: "center",
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("NÚMERO DE CÉDULA")],
                                            width: { size: 25, type: WidthType.PERCENTAGE },
                                            verticalAlignment: "center",
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("PERÍODO LECTIVO DE MATRÍCULA ACTUAL")],
                                            width: { size: 25, type: WidthType.PERCENTAGE },
                                            verticalAlignment: "center",
                                        }),
                                    ],
                                }),
                                // Aquí puedes agregar más filas con datos de estudiantes
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph("Nombre Estudiante 1")] }),
                                        new TableCell({ children: [new Paragraph("1234567890")] }),
                                        new TableCell({ children: [new Paragraph("2024-1")] }),
                                    ],
                                }),
                                // Agrega más filas según sea necesario
                            ],
                        }),

                        new Paragraph({
                            text: "Por lo expuesto, y una vez chequeado el portafolio de vinculación de cada estudiante, informo que los estudiantes mencionados sí están en capacidad de realizar las horas de Labores Comunitarias Estudiantiles detalladas.",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Así mismo pongo a su conocimiento que por encontrarse en periodo ordinario/extraordinario, el cronograma de actividades no excederá de 4/6 horas por día.",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Con sentimientos de distinguida consideración.",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Atentamente,",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Ing. Ibarra Martínez Mario Alberto, M.Sc.",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Docente Responsable de Vinculación con la Colectividad “Dr. Jacobo Bucaram Ortiz”",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Computación",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Cédula de identidad: 0921324935",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Adjuntar copia legible de cédula de identidad e historial de matrícula de cada estudiante descargado del Sistema Académico.",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Máximo 4 estudiantes por proyecto, exceptuando los proyectos macro aprobados por el Honorable Consejo Universitario.",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                        new Paragraph({
                            text: "Tiempo de validez de la carta: 20 días",
                            spacing: { after: 300 },
                            font: "Arial",
                            size: 24,
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "Autorizacion_LCE.docx");
        });
    };

    return (
        <div>
            <h1>Generar Documento</h1>
            <button onClick={handleDownload}>Descargar Documento</button>
        </div>
    );
};

export default GenerarDocumento;