import PropTypes from 'prop-types';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const DownloadWord = ({ title, content, tableData }) => {
    const generateWordDocument = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: title.toUpperCase(),
                                bold: true,
                                font: "Arial", // Cambiar tipo de letra
                                size: 32, // Tamaño de letra en puntos
                            }),
                        ],
                        alignment: AlignmentType.CENTER, // Centrar el título
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: content,
                                font: "Arial",
                                size: 22, // Tamaño de letra
                            }),
                        ],
                    }),
                    // Crear la tabla
                    new Table({
                        rows: tableData.map(row => 
                            new TableRow({
                                children: row.map(cellContent => 
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: cellContent,
                                                        font: "Arial",
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    })
                                ),
                            })
                        ),
                    }),
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "example.docx");
        });
    };

    return (
        <button onClick={generateWordDocument}>
            Descargar Documento Word
        </button>
    );
};

DownloadWord.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired, // Datos de la tabla
};

export default DownloadWord;