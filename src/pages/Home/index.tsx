import { Timestamp } from "firebase/firestore";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TodoItem } from "../../components/TodoITem";
import { MainContext } from "../../contexts";
import { useQueries } from "../../hooks/useQueries";
import { parserLocale } from "../../utils/parses";
import { FaSearch } from "react-icons/fa";
import "./styles.scss";
import { BiLogOut } from "react-icons/bi";
import { MdPictureAsPdf } from "react-icons/md";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFPage } from "../../PdfComponents/Page";

const date = new Date();
const primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];

export function HomePage() {
	const { items, setItems } = useContext(MainContext);
	const { getItems, fazerLogOff } = useQueries();
	const navigate = useNavigate();
	const inicioRef = useRef(primeiroDia);
	const fimRef = useRef(ultimoDia);
	const totalEntradas = useRef(0);
	const totalSaidas = useRef(0);


	useEffect(() => {
		try {
			const inicio = Timestamp.fromDate(new Date(primeiroDia));
			const fim = Timestamp.fromDate(new Date(ultimoDia));
			getItems({ inicio, fim })
				.then(response => {
					setItems(response ?? null);
				})
				.catch(error => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
		}
	}, [getItems, setItems]);

	const handleCalcItems = () => {
		const result = items?.reduce((prev, curr) => {
			if (curr.tipo === "ENTRADA") {
				prev.entradas += curr.value;
			} else {
				prev.saidas += curr.value;
			}

			return prev;
		}, { entradas: 0, saidas: 0 });
		return result;
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

	const handleAddItem = () => {
		try {
			navigate("/addItem");
		}
		catch (error) {
			console.log(error);
		}
	};

	const handleGetItems = async () => {
		try {
			const inicio = inicioRef.current;
			const fim = fimRef.current;

			if (inicio && fim) {
				getItems({ inicio: Timestamp.fromDate(new Date(inicio)), fim: Timestamp.fromDate(new Date(fim)) })
					.then(response => {
						setItems(response ?? null);
					})
					.catch(error => {
						console.log(error);
					});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleLogOf = () => {
		try {
			fazerLogOff();
		} catch (error) {
			console.log(error);
		}
	};

	const PDFBUTTON = (() => {
		try {
			if (items && inicioRef.current && fimRef.current) {
				return (
					<PDFDownloadLink
						fileName="Realatório"
						document={<PDFPage
							items={items}
							inicio={new Date(`${inicioRef.current}`)}
							fim={new Date(`${fimRef.current}`)}
						/>}
					>
						<button className="export-button litte-button">
							<MdPictureAsPdf color="#fff" size={18} />
						</button>
					</PDFDownloadLink>
				);
			}
		} catch (error) {
			console.log(error);
			return null;
		}
	})();

	return (
		<div className="page home-page">
			<div className="container-area">
				<div className="header-area">
					<div className="header-box">
						<h3>Entradas</h3>
						<h2>{parserLocale(totalEntradas.current)}</h2>
					</div>
					<div className="header-box second-box">
						<h3>Saída</h3>
						<h2>{parserLocale(totalSaidas.current)}</h2>
					</div>
				</div>
				<div className="periodo-area">
					<div className="dates-area">
						<div className="periodo-box">
							<label htmlFor="">Inicio</label>
							<input
								type="date"
								defaultValue={primeiroDia}
								onChange={event => inicioRef.current = event.target.value}
							/>
						</div>
						<div className="periodo-box">
							<label htmlFor="">Fim</label>
							<input
								type="date"
								defaultValue={ultimoDia}
								onChange={event => fimRef.current = event.target.value}
							/>
						</div>
					</div>
					<button className="find-button" onClick={handleGetItems}>
						<p>Buscar</p>
						<FaSearch color="#fff" size={16} />
					</button>
				</div>
				<div className="items-area">
					{items?.map(item => <TodoItem key={item.id} item={item} />)}
				</div>
				<div className="buttons-area">
					<>
						<button className="logOff-button litte-button" onClick={handleLogOf}>
							<BiLogOut color="#fff" size={18} />
						</button>
						<button className="main-button" onClick={handleAddItem}>Adicionar novo</button>
						{PDFBUTTON ?? null}
					</>
				</div>
			</div>
		</div>
	);
}