import { useRef } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { TodoItemProps } from "../../types";
import { parserLocale } from "../../utils/parses";

// Create styles
const styles = StyleSheet.create({
	page: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#E4E4E4",
		padding: 16,
	},
	headerArea: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		height: 90,
		marginBottom: 12,
	},
	headerBox: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		width: "49%",
		borderRadius: 8,
	},
	headerTitle: {
		color: "#fff",
		fontSize: 24
	},
	headerText: {
		color: "#fff",
		fontSize: 16
	},
	subHeader: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#ccc",
		padding: 8,
		marginBottom: 12,
		borderRadius: 8
	},
	contentArea: {
		width: "100%",
		flexGrow: 1,
		backgroundColor: "#ccc",
		borderRadius: 8,
		padding: 12
	},
	itemContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginBottom: 8,
		paddingBottom: 4,
		borderBottom: "1px solid #777"
	},
	headerTitleItem: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	titleItem: {
		fontSize: 14,
	},
	textItem: {
		color: "#777",
		fontSize: 12,
	},
});

interface PDFPageProps {
	items: TodoItemProps[] | null;
	inicio: Date;
	fim: Date;
}

// Create Document Component
export const PDFPage = ({ items, fim, inicio }: PDFPageProps) => {
	const totalEntradas = useRef(0);
	const totalSaidas = useRef(0);

	const handleCalcItems = () => {
		try {
			const result = items?.reduce((prev, curr) => {
				if (curr.tipo === "ENTRADA") {
					prev.entradas += curr.value;
				} else {
					prev.saidas += curr.value;
				}

				return prev;
			}, { entradas: 0, saidas: 0 });
			return result;
		} catch (error) {
			console.log(error);
		}
	};

	(() => {
		try {
			const result = handleCalcItems();
			if (result) {
				const { entradas, saidas } = result;
				totalEntradas.current = entradas;
				totalSaidas.current = saidas;
			} else {
				totalEntradas.current = 0;
				totalSaidas.current = 0;
			}
		} catch (error) {
			console.log(error);
		}
	})();

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.headerArea}>
					<View style={{ ...styles.headerBox, backgroundColor: "#3AC977" }}>
						<Text style={styles.headerTitle}>Entradas</Text>
						<Text style={styles.headerText}>{parserLocale(totalEntradas.current)}</Text>
					</View>
					<View style={{ ...styles.headerBox, backgroundColor: "#d2531c" }}>
						<Text style={styles.headerTitle}>Saídas</Text>
						<Text style={styles.headerText}>{parserLocale(totalSaidas.current)}</Text>
					</View>
				</View>
				<View style={styles.subHeader}>
					<Text style={styles.textItem}>Resultados: {items?.length.toLocaleString("pt-BR", { minimumIntegerDigits: 2 })}</Text>
					<Text style={styles.textItem}>Período: {inicio.toLocaleDateString("pt-BR")} - {fim.toLocaleDateString("pt-BR")}</Text>
				</View>
				<View style={styles.contentArea}>
					{items?.map(item => <ItemComponent key={item.id} item={item} />)}
				</View>
			</Page>
		</Document>
	);
};

function ItemComponent({ item }: { item: TodoItemProps }) {

	return (
		<View key={item.id} style={styles.itemContainer} wrap={false}>
			<View style={styles.headerTitleItem}>
				<Text style={styles.titleItem}>{item.title} - {parserLocale(item.value)}</Text>
				<Text style={styles.titleItem}>{item.status}</Text>
			</View>
			<Text style={styles.textItem}>{item.description}</Text>
		</View>
	);
}