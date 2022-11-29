sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"sap/m/Text",
	"sap/m/Button"

], function (MessageToast, Controller, Log, JSONModel, Text, Button) {
	"use strict";

	return Controller.extend("projectbetelgas.controller.View2", {

		onInit() {

			window.modoFormularioCliente = "cadastro"
			window.modoFormularioProduto = "cadastroProd"

			this.selectClientTable();
			this.selectProdTable();

			/*var oDataSetModelProd = {

				aProduto: [
					{
						produto: "Botijão Gás GLP", descricao: "Gás Liquefeito de Petróleo P13", preco: "110R$", quantidadeEstoque: "62"
					}
				]


			}*/

			var oDataSetModelVenda = {

				aVenda: [
					{
						produto: "Botijão Gás GLP", cliente: "Aluizio Antonio", preco: "110R$", quantidade: "1", data: " 20/10/2022", proximaCompraEstimada: "20/12/2022"
					}
				]


			}

			var oDataSetModelEstoque = {

				aEstoque: [
					{
						produto: "Botijão Gás GLP", descricao: "Gás Liquefeito de Petróleo P13", quantidade: "18"
					},
					{
						produto: "Registro", descricao: "Registro de Botijão P13", quantidade: "21"
					},
					{
						produto: "Mangueira", descricao: "Para Botijão P13", quantidade: "23"
					}
				]


			}

			var oDataSetModelCaixa =

			{
				currency: "BRL",
				price: 17600
			}

			//var oModelProd = new JSONModel(oDataSetModelProd);
			var oModelVenda = new JSONModel(oDataSetModelVenda);
			var oModelEstoque = new JSONModel(oDataSetModelEstoque);
			var oModelCaixa = new JSONModel(oDataSetModelCaixa);


			//this.getView().setModel(oModelProd, "modelProd");
			this.getView().setModel(oModelVenda, "modelVenda");
			this.getView().setModel(oModelEstoque, "modelEstoque");
			this.getView().setModel(oModelCaixa, "modelCaixa");
		},
		//Clientes
		selectClientTable() {
			var that = this;

			//Selecionando todos os Clientes
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/clientes/client",

				success: function (oResponse) {
					debugger
					var oModel = new JSONModel({
						aNome: oResponse.response
					});

					that.getView().setModel(oModel, "modelCliente");
				},
				error: function (oResponse) {
					debugger
				}
			});

		},

		clearFormInput: function (oParam) {
			debugger
			oParam.oInputNome.setValue("")
			oParam.oInputSobrenome.setValue("")
			oParam.oInputTelefone.setValue("")
			oParam.oInputWhatsapp.setValue("")
			oParam.oInputEndereco.setValue("")
			oParam.oInputCep.setValue("")

		},

		onPress: function (evt) {
			debugger
			var oInputNome = this.getView().byId("input-a")
			var oInputSobrenome = this.getView().byId("input-b")
			var oInputTelefone = this.getView().byId("input-c")
			var oInputWhatsapp = this.getView().byId("input-d")
			var oInputEndereco = this.getView().byId("input-e")
			var oInputCep = this.getView().byId("input-f")

			var oCreateData = new Date();

			var that = this;



			if (window.modoFormularioCliente == "cadastro") {
				var oPostClient = {

					"name_cli": oInputNome.getValue(),
					"surname_cli": oInputSobrenome.getValue(),
					"fone1_cli": oInputTelefone.getValue(),
					"fone2_cli": oInputWhatsapp.getValue(),
					"adress_cli": oInputEndereco.getValue(),
					"cep_cli": oInputCep.getValue(),
					"createdate_cli": oCreateData.toISOString().slice(0, 10),
					"status_cli": 1
				}
				// Inserindo um novo cliente
				$.ajax({
					type: "POST",
					url: "http://localhost:3000/clientes/client",
					data: oPostClient,

					success: function (oResponse) {
						debugger
						var oParam = {
							oInputNome: oInputNome,
							oInputSobrenome: oInputSobrenome,
							oInputTelefone: oInputTelefone,
							oInputWhatsapp: oInputWhatsapp,
							oInputEndereco: oInputEndereco,
							oInputCep: oInputCep
						}

						that.clearFormInput(oParam);

						that.selectClientTable();

						MessageToast.show("Cadastrado com Sucesso");
					},
					error: function (oResponse) {
						debugger
					}

				});

			}

			if (window.modoFormularioCliente == "edit") {

				var oUpdateCliente = that.getView().getModel("oModelEditCli").getData();

				$.ajax({
					type: "PUT",
					url: "http://localhost:3000/clientes",
					data: oUpdateCliente,

					success: function (oResponse) {
						debugger
						var oParam = {
							oInputNome: oInputNome,
							oInputSobrenome: oInputSobrenome,
							oInputTelefone: oInputTelefone,
							oInputWhatsapp: oInputWhatsapp,
							oInputEndereco: oInputEndereco,
							oInputCep: oInputCep
						}

						that.clearFormInput(oParam);

						that.selectClientTable();

						window.modoFormularioCliente = "cadastro";

						that.getView().byId("btnCliente").setText("Cadastrar")

						MessageToast.show("Atualizado com Sucesso");
					},
					error: function (oResponse) {
						debugger
					}

				});

			}

		},

		onPressEdit: function (oEvent) {
			debugger
			var that = this;
			//Pegar o elemento que foi clicado, guardar na variavel esse objeto
			//criar um model com a variavel criada, mandando como parametro de definição
			//Setar o model na view com o alias que já está definido (oModelEditCli)
			//criar uma variavel global para decidir se é modo cadastro ou modo edição
			var oLinhaClicada = oEvent.getSource().getBindingContext("modelCliente").getProperty()
			var oModel = new JSONModel(oLinhaClicada);

			that.getView().setModel(oModel, "oModelEditCli");

			that.getView().byId("btnCliente").setText("Atualizar");

			window.modoFormularioCliente = "edit"

			that.getView().byId("idIconTabBarCliente").setSelectedKey(0)

		},

		onPressDelete: function (oEvent) {
			debugger
			var that = this;
			var oLinhaClicada = oEvent.getSource().getBindingContext("modelCliente").getProperty()


			//DIALOG/MODAL/POPUP COM BOTAO
			if (!oDialog) {

				var oDialog = new sap.m.Dialog({
					//contentHeight: '100%',
					//contentWidth: '100%',
					title: 'Excluir Cliente',
					content: new Text({ text: "Deseja deletar esse registro?" }),
					beginButton: new Button({
						text: 'Cancelar',
						type: sap.m.ButtonType.Reject,
						press: function () {
							oDialog.close();
						}
					}),
					endButton: new Button({
						text: 'Confirmar',
						type: sap.m.ButtonType.Accept,
						press: function () {
							oDialog.close();
							that.deleteSlice(oLinhaClicada.client_id_cli, oLinhaClicada.name_cli);
						}
					}),
					afterClose: function () {
						oDialog.destroy();
					}
				});

				that.getView().addDependent(oDialog);

				oDialog.open();
			} else {
				oDialog.open();
			}

		},

		deleteSlice: function (sIddelecao, sNameDelecao) {
			var that = this;

			var oPayloadDelecao = {
				"client_id_cli": sIddelecao,
				"name_cli": sNameDelecao
			}
			// Deletando um cliente
			$.ajax({
				type: "DELETE",
				url: "http://localhost:3000/clientes/client",
				data: oPayloadDelecao,

				success: function (oResponse) {
					debugger
					MessageToast.show("Item " + sIddelecao + " " + sNameDelecao + " Deletado com Sucesso");
					that.selectClientTable();
				},
				error: function (oResponse) {
					debugger
				}
			})

		},

		//Produtos
		selectProdTable() {
			var that = this;

			//Selecionando todos os Produtos
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/produtos/product",

				success: function (oResponse) {
					debugger
					var oModelProd = new JSONModel({
						aProduto: oResponse.response
					});

					that.getView().setModel(oModelProd,"modelProd");
				},
				error: function (oResponse) {
					debugger
				}
			});

		},

		clearFormInputProd: function (oParam) {
			debugger
			oParam.oInputNomePdt.setValue("")
			oParam.oInputDescriptionPdt.setValue("")
			oParam.oInputStockControl.setValue("")
			oParam.oInputStockMin.setValue("")
			oParam.oInputPricePdt.setValue("")

		},

		onPressPdt: function (evt) {
			debugger
			var oInputNomePdt = this.getView().byId("input-h")
			var oInputDescriptionPdt = this.getView().byId("input-i")
			var oInputStockControl = this.getView().byId("input-j")
			var oInputStockMin = this.getView().byId("input-k")
			var oInputPricePdt = this.getView().byId("input-l")

			var oCreateData = new Date();

			var that = this;

			if (window.modoFormularioProduto == "cadastroProd") {
				var oPostProduct = {

					"name_pdt": oInputNomePdt.getValue(),
					"description_pdt": oInputDescriptionPdt.getValue(),
					"stock_control_pdt": oInputStockControl.getValue(),
					"stock_min_pdt": oInputStockMin.getValue(),
					"creation_date_pdt": oCreateData.toISOString().slice(0, 10),
					"price_pdt": oInputPricePdt.getValue(),
					"status_pdt": 1
				}
				// Inserindo um novo Produto
				$.ajax({
					type: "POST",
					url: "http://localhost:3000/produtos/product",
					data: oPostProduct,

					success: function (oResponse) {
						debugger
						var oParam = {
							oInputNomePdt: oInputNomePdt,
							oInputDescriptionPdt: oInputDescriptionPdt,
							oInputStockControl: oInputStockControl,
							oInputStockMin: oInputStockMin,
							oInputPricePdt: oInputPricePdt
						}

						that.clearFormInputProd(oParam);

						that.selectProdTable();

						MessageToast.show("Cadastrado com Sucesso");
					},
					error: function (oResponse) {
						debugger
					},

				});

			}

			if (window.modoFormularioProduto == "editProd"){

				var oUpdateProduto = that.getView().getModel("oModelEditProd").getData();

				$.ajax({
					type: "PUT",
					url: "http://localhost:3000/produtos",
					data: oUpdateProduto,

					success: function (oResponse) {
						debugger
						var oParam = {
							oInputNomePdt: oInputNomePdt,
							oInputDescriptionPdt: oInputDescriptionPdt,
							oInputStockControl: oInputStockControl,
							oInputStockMin: oInputStockMin,
							oInputPricePdt: oInputPricePdt
						}

						that.clearFormInputProd(oParam);

						that.selectProdTable();

						window.modoFormularioProduto = "cadastroProd";

						that.getView().byId("btnProduto").setText("Cadastrar")

						MessageToast.show("Atualizado com Sucesso");
					},
					error: function (oResponse) {
						debugger
					}

				});

			}

		},

		onPressEditProd: function (oEvent) {
			debugger
			var that = this;
			//Pegar o elemento que foi clicado, guardar na variavel esse objeto
			//criar um model com a variavel criada, mandando como parametro de definição
			//Setar o model na view com o alias que já está definido (oModelEditCli)
			//criar uma variavel global para decidir se é modo cadastro ou modo edição
			var oLinhaClicadaProd = oEvent.getSource().getBindingContext("modelProd").getProperty()
			var oModelProd = new JSONModel(oLinhaClicadaProd);

			that.getView().setModel(oModelProd, "oModelEditProd");

			that.getView().byId("btnProduto").setText("Atualizar");

			window.modoFormularioCliente = "editProd"

			that.getView().byId("idIconTabBarProduto").setSelectedKey(0)

		},

		onPressDeleteProd: function (oEvent) {
			debugger
			var that = this;
			var oLinhaClicadaProd = oEvent.getSource().getBindingContext("modelProd").getProperty()


			//DIALOG/MODAL/POPUP COM BOTAO
			if (!oDialog) {

				var oDialog = new sap.m.Dialog({
					title: 'Excluir Produto',
					content: new Text({ text: "Deseja deletar esse registro?" }),
					beginButton: new Button({
						text: 'Cancelar',
						type: sap.m.ButtonType.Reject,
						press: function () {
							oDialog.close();
						}
					}),
					endButton: new Button({
						text: 'Confirmar',
						type: sap.m.ButtonType.Accept,
						press: function () {
							oDialog.close();
							that.deleteSliceProd(oLinhaClicadaProd.id_product_pdt, oLinhaClicadaProd.name_pdt);
						}
					}),
					afterClose: function () {
						oDialog.destroy();
					}
				});

				that.getView().addDependent(oDialog);

				oDialog.open();
			} else {
				oDialog.open();
			}

		},

		deleteSliceProd: function (sIddelecaoProd, sNameDelecaoProd) {
			var that = this;

			var oPayloadDelecaoProd = {
				"id_product_pdt": sIddelecaoProd,
				"name_pdt": sNameDelecaoProd
			}
			// Deletando um cliente
			$.ajax({
				type: "DELETE",
				url: "http://localhost:3000/produtos/product",
				data: oPayloadDelecaoProd,

				success: function (oResponse) {
					debugger
					MessageToast.show("Item " + sIddelecaoProd + " " + sNameDelecaoProd + " Deletado com Sucesso");
					that.selectProdTable();
				},
				error: function (oResponse) {
					debugger
				}
			})

		},


		/*onPressSales: function(evt) {
			debugger
			var oInputProdSale = this.getView().byId("input-m")
			var oInputClientSale = this.getView().byId("input-n")
			var oInputTelefoneSale = this.getView().byId("input-o")
			var oInputQtdeSale = this.getView().byId("input-p")
			

			var oCreateData = new Date();
			var oPostSale = {
				"name_pdt" : oInputNomePdt.getValue(),
				"description_pdt": oInputDescriptionPdt.getValue(),
				"stock_control_pdt": oInputStockControl.getValue(),
				"stock_min_pdt": oInputStockMin.getValue(),
				"creation_date_pdt": oCreateData.toISOString().slice(0,10),
				"price_pdt": oInputPricePdt.getValue(),
				"status_pdt": 1
			}
			// Inserindo um novo Produto
			$.ajax({
				type: "POST",
				url: "http://localhost:3000/produtos/product",
				data: oPostProduct,
	
					success: function (oResponse) {
						oInputNomePdt.setValue("")
						oInputDescriptionPdt.setValue("")
						oInputStockControl.setValue("")
						oInputStockMin.setValue("")
						oInputPricePdt.setValue("")
					},

					error: function (oResponse) {
						
					},

				});




			MessageToast.show(evt.getSource().getId() + "Pressed");
		},*/

		onPressNewProduct: function (evt) {
			MessageToast.show(evt.getSource().getId() + "Pressed");
		},

		onPressDarkMode: function (oEvent) {

			var sStatusBotao = oEvent.getSource().getState()
			if (sStatusBotao == true) {
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
			}
			else {
				sap.ui.getCore().applyTheme("sap_horizon");
			}
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},

		openDateRangeSelection: function (oEvent) {
			this.getView().byId("SaleDRS").openBy(oEvent.getSource().getDomRef());
		},

		changeDateSales: function (oEvent) {
			MessageToast.show("Data escolhida: " + oEvent.getParameter("value"));
		},

		openDateRangeSelectionTwo: function (oEvent) {
			this.getView().byId("TotalDRS").openBy(oEvent.getSource().getDomRef());
		},

		changeDateTotal: function (oEvent) {
			MessageToast.show("Data escolhida: " + oEvent.getParameter("value"));
		}


	});
});