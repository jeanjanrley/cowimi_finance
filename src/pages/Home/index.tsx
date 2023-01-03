import { useContext, useEffect, useRef, useState } from "react";
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
import { TodoItemProps } from "../../types";
import { Button } from "../../components/Button";
import { EmpresaComponent } from "../../components/EmpresaComponent";

const date = new Date();
const primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];

export function HomePage() {
	const { items, setItems, user, empresa, setEmpresa } = useContext(MainContext);
	const { getItems, fazerLogOff, getCompany } = useQueries();
	const navigate = useNavigate();
	const [inicio, setInicio] = useState(primeiroDia);
	const [fim, setFim] = useState(ultimoDia);
	const totalEntradas = useRef(0);
	const totalSaidas = useRef(0);
	const [reorderedItems, setReorderedItems] = useState<TodoItemProps[] | null>();

	// Busca a empresa cadastrada
	useEffect(() => {
		user && getCompany({ userId: user.uid })
			.then(response => setEmpresa(response ?? null))
			.catch(error => {
				console.log(error);
				setEmpresa(null);
			});
	}, [getCompany, setEmpresa, user]);

	// Busca os itens
	useEffect(() => {
		getItems({ inicio: new Date(primeiroDia), fim: new Date(ultimoDia) })
			.then(response => {
				setItems(response ?? null);
			})
			.catch(error => {
				console.log(error);
				setItems(null);
			});
	}, [empresa, getItems, setItems]);

	// Reordena os itens por data
	useEffect(() => {
		try {
			if (items) {
				const reorder = items.sort((a, b) => a?.vencimento.seconds > b?.vencimento.seconds ? + 1 : -1);
				setReorderedItems([...reorder]);
			}
		} catch (error) {
			console.log(error);
		}
	}, [items]);

	const handleGetItems = async () => {
		if (inicio && fim) {
			getItems({ inicio: new Date(inicio), fim: new Date(fim) })
				.then(response => {
					setItems(response ?? null);
				})
				.catch(error => {
					console.log(error);
					setItems(null);
				});
		}
	};

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

	const handleLogOf = () => {
		try {
			fazerLogOff();
		} catch (error) {
			console.log(error);
		}
	};

	const PDFBUTTON = (() => {
		try {
			if (reorderedItems && inicio && fim) {
				return (
					<PDFDownloadLink
						fileName="Realatório"
						document={<PDFPage
							items={reorderedItems}
							inicio={new Date(`${inicio}T00:00:00`)}
							fim={new Date(`${fim}T23:59:59`)}
							empresa={empresa ?? undefined}
						/>}
					>
						<Button className="export-button litte-button">
							<MdPictureAsPdf color="#fff" size={18} />
						</Button>
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
				<EmpresaComponent empresa={empresa ?? undefined} />
				<div className="periodo-area">
					<div className="dates-area">
						<div className="periodo-box">
							<label htmlFor="">Inicio</label>
							<input
								type="date"
								defaultValue={primeiroDia}
								onChange={event => setInicio(event.target.value)}
							/>
						</div>
						<div className="periodo-box">
							<label htmlFor="">Fim</label>
							<input
								type="date"
								defaultValue={ultimoDia}
								onChange={event => setFim(event.target.value)}
							/>
						</div>
					</div>
				</div>
				<div className="header-area">
					<div className="header-box">
						<h3>Entradas</h3>
						<h2>{parserLocale(totalEntradas.current)}</h2>
					</div>
					<div className="header-box second-box">
						<h3>Saídas</h3>
						<h2>{parserLocale(totalSaidas.current)}</h2>
					</div>
				</div>
				<div className="items-area">
					{reorderedItems?.map(item => <TodoItem key={item.id} item={item} />)}
				</div>
				<div className="buttons-area">
					<>
						<Button className="logOff-button litte-button" onClick={handleLogOf}>
							<BiLogOut color="#fff" size={18} />
						</Button>
						<Button className="main-button" onClick={handleAddItem}>Adicionar novo</Button>
						{PDFBUTTON ?? null}
						<Button className="search-button litte-button" onClick={handleGetItems}>
							<FaSearch color="#fff" size={18} />
						</Button>
					</>
				</div>
			</div>
		</div>
	);
}