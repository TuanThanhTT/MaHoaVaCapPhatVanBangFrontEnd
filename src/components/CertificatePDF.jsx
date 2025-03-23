import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 20, textAlign: "center", marginBottom: 20 },
    text: { fontSize: 14, marginBottom: 5 },
});

const CertificatePDF = ({ info }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Chứng chỉ tốt nghiệp</Text>
            <Text style={styles.text}>Tên Sinh Viên: {info.name}</Text>
            <Text style={styles.text}>Mã Sinh Viên: {info.studentId}</Text>
            <Text style={styles.text}>Chuyên ngành: {info.major}</Text>
            <Text style={styles.text}>Điểm GPA: {info.gpa}</Text>
        </Page>
    </Document>
);

export default CertificatePDF;
