import { useRef, useContext } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { CompanyProps, TodoItemProps } from "../../types";
import { parserLocale } from "../../utils/parses";
import { MainContext } from "../../contexts";

// Create styles
const styles = StyleSheet.create({
	page: {
		display: "flex",
		flexDirection: "column",
		border: "1px dashed #000",
		padding: 16,
	},
	companyHeader: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		padding: 8,
		marginBottom: 12,
		borderRadius: 8,
		border: "1px dashed #000",
	},
	headerArea: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		height: 90,
		marginBottom: 12,
	},
	companyText: {
		color: "#000",
		fontSize: 12,
		marginBottom: 4,
	},
	headerBox: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		width: "49%",
		borderRadius: 8,
		border: "1px dashed #000"
	},
	headerTitle: {
		color: "#000",
		fontSize: 24
	},
	headerText: {
		color: "#000",
		fontSize: 16
	},
	subHeader: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		border: "1px dashed #000",
		padding: 8,
		marginBottom: 12,
		borderRadius: 8
	},
	contentArea: {
		width: "100%",
		flexGrow: 1,
		border: "1px dashed #000",
		borderRadius: 8,
		padding: 8
	},
	itemContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginBottom: 8,
		paddingBottom: 4,
		borderBottom: "1px solid #000"
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
		color: "#000",
		fontSize: 12,
	},
	litteText: {
		color: "#000",
		fontSize: 11,
	},
});

interface PDFPageProps {
	items: TodoItemProps[] | null;
	inicio: Date;
	fim: Date;
	empresa?: CompanyProps;
}

const replaceDate = (date: Date) => {
	const stringDate = date.toLocaleDateString("pt-BR");
	return stringDate;
};

// Create Document Component
export const PDFPage = ({ items, fim, inicio, empresa }: PDFPageProps) => {
	const totalEntradas = useRef(0);
	const totalSaidas = useRef(0);

	const endere??o = (() => {
		if (empresa) {
			const { rua, numero, cidade, bairro, uf } = empresa;
			const endereco = `${rua}, ${numero}, ${bairro}, ${cidade} - ${uf}`;
			return endereco;
		}
	})();

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
				{empresa &&
					<View style={styles.companyHeader}>
						<Text style={styles.companyText}>Nome fantasia: {empresa.nomeFantasia}</Text>
						<Text style={styles.companyText}>raz??o Social: {empresa.razaoSocial}</Text>
						<Text style={styles.companyText}>CNPJ: {empresa.cnpj}</Text>
						{endere??o && <Text style={styles.textItem}>endere??o: {endere??o}</Text>}
					</View>
				}
				<View style={styles.headerArea}>
					<View style={{ ...styles.headerBox }}>
						<Text style={styles.headerTitle}>Entradas</Text>
						<Text style={styles.headerText}>{parserLocale(totalEntradas.current)}</Text>
					</View>
					<View style={{ ...styles.headerBox }}>
						<Text style={styles.headerTitle}>Sa??das</Text>
						<Text style={styles.headerText}>{parserLocale(totalSaidas.current)}</Text>
					</View>
				</View>
				<View style={styles.subHeader}>
					<Text style={styles.textItem}>Resultados: {items?.length.toLocaleString("pt-BR", { minimumIntegerDigits: 2 })}</Text>
					<Text style={styles.textItem}>Per??odo: {replaceDate(inicio)} - {replaceDate(fim)}</Text>
				</View>
				<View style={styles.contentArea}>
					{items?.map(item => <ItemComponent key={item.id} item={item} />)}
				</View>
			</Page>
		</Document>
	);
};

function ItemComponent({ item }: { item: TodoItemProps }) {
	const date = item.vencimento?.toDate();

	return (
		<View key={item.id} style={styles.itemContainer} wrap={false}>
			<View style={styles.headerTitleItem}>
				<Text style={styles.titleItem}>{item.title} - {parserLocale(item.value)}</Text>
				<Text style={styles.titleItem}>{item.status}</Text>
			</View>
			<View style={styles.headerTitleItem}>
				<Text style={styles.litteText}>{item.tipo} - {item.description}</Text>
				<Text style={styles.litteText}>{date?.toLocaleDateString("pt-BR")}</Text>
			</View>
		</View>
	);
}