sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/ui/core/UIComponent"
	


], function (MessageToast, Controller, Log, JSONModel, Text, Button, List, StandardListItem, UIComponent) {
	"use strict";

	return Controller.extend("projectbetelgas.controller.View2", {


		onInit() { 
			debugger
			var that = this;
			if ( !window.HotDog ) {
				 UIComponent.getRouterFor(that).navTo("RouteView1")
			}

			window.modoFormularioCliente = "cadastro";
			window.modoFormularioProduto = "cadastroProd";
			window.sValorTotalVenda = 0

			this.selectClientTable();
			this.selectProdTable();
			this.selectSalesTable();
			this.initModelItemVenda();
			this.selectTotalSalesCash();
			this.selectTotalSales();
			this.initModelCaixa();
			

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
					var oModelCliente = {
						aCliente: oResponse.response
					};

					var oModel = new JSONModel(oModelCliente);

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

			if (oInputNome.getValue() == "" || oInputNome.getValue() == null) {
				MessageToast.show("Campo Nome Obrigatório")

				return
			};
			if (oInputSobrenome.getValue() == "" || oInputSobrenome.getValue() == null) {
				MessageToast.show("Campo Sobrenome Obrigatório")

				return
			};
			if (oInputWhatsapp.getValue() == "" || oInputWhatsapp.getValue() == null) {
				MessageToast.show("Campo Whatsapp Obrigatório")

				return
			};
			if (oInputEndereco.getValue() == "" || oInputEndereco.getValue() == null) {
				MessageToast.show("Campo Endereço Obrigatório")

				return
			};
			if (oInputCep.getValue() == "" || oInputCep.getValue() == null) {
				MessageToast.show("Campo Cep Obrigatório")

				return
			};

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

					that.getView().setModel(oModelProd, "modelProd");
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

			if (oInputNomePdt.getValue() == "" || oInputNomePdt.getValue() == null) {
				MessageToast.show("Campo Nome Obrigatório")

				return
			};
			if (oInputStockControl.getValue() == "" || oInputStockControl.getValue() == null) {
				MessageToast.show("Campo Quantidade em Estoque Obrigatório")

				return
			};
			if (oInputStockMin.getValue() == "" || oInputStockMin.getValue() == null) {
				MessageToast.show("Campo Estoque Minimo Obrigatório")

				return
			};
			if (oInputPricePdt.getValue() == "" || oInputPricePdt.getValue() == null) {
				MessageToast.show("Campo Preço Obrigatório")

				return
			};

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

			if (window.modoFormularioProduto == "editProd") {

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
			var oLinhaClicadaProd = oEvent.getSource().getBindingContext("modelProd").getProperty()
			var oModelProd = new JSONModel(oLinhaClicadaProd);

			that.getView().setModel(oModelProd, "oModelEditProd");

			that.getView().byId("btnProduto").setText("Atualizar");

			window.modoFormularioProduto = "editProd"

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
					MessageToast.show("Item " + sIddelecaoProd + " " + sNameDelecaoProd + " Excluido com Sucesso");
					that.selectProdTable();
				},
				error: function (oResponse) {
					debugger
				}
			})

		},

		//Vendas

		selectSalesTable() {
			var that = this;
			debugger
			//Selecionando todas as Vendas
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/vendas/sale",

				success: function (oResponse) {
					debugger

					var aItenVendas = oResponse.response;

					aItenVendas.forEach(oItemVenda => {
						oItemVenda.creationdate_sl = new Date(oItemVenda.creationdate_sl)

					});

					var oModelVenda = new JSONModel({
						aVenda: aItenVendas
					});

					that.getView().setModel(oModelVenda, "modelVenda");
				},
				error: function (oResponse) {
					debugger
				}
			});

		},

		initModelCaixa() {
			var that = this;

			var oModelCaixa = new JSONModel();

			that.getView().setModel(oModelCaixa, "modelCaixa");
		},

		selectTotalSalesCash() {
			var that = this;
			debugger
			//Selecionando total Caixa
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/vendas/caixa",

				success: function (oResponse) {
					debugger
					var sCaixa = oResponse.response[0].valorTotal;

					that.getView().getModel("modelCaixa").setProperty("/sCaixa", sCaixa);

				},
				error: function (oResponse) {
					debugger
				}
			});

		},

		selectTotalSales() {
			var that = this;
			debugger
			//Selecionando total de Vendas
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/vendas/salesTotal",

				success: function (oResponse) {
					debugger


					var sVendas = oResponse.response[0].vendasTotal;

					that.getView().getModel("modelCaixa").setProperty("/sVendas", sVendas);

				},
				error: function (oResponse) {
					debugger
				}
			});

		},


		StockControlSale: function (sIdProduto, sEstoqueAdeduzir) {
			debugger
			var that = this;
			// Selecionando por id
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/produtos/" + sIdProduto,

				success: function (oResponse) {
					debugger
					var oPayloadStockControl = {
						"id_product_pdt": sIdProduto,
						"name_pdt": oResponse.response[0].name_pdt,
						"description_pdt": oResponse.response[0].description_pdt,
						"stock_control_pdt": oResponse.response[0].stock_control_pdt - parseInt(sEstoqueAdeduzir),
						"stock_min_pdt": oResponse.response[0].stock_min_pdt,
						"creation_date_pdt": oResponse.response[0].creation_date_pdt,
						"status_pdt": oResponse.response[0].status_pdt,
						"price_pdt": oResponse.response[0].price_pdt,

					};

					$.ajax({
						type: "PUT",
						url: "http://localhost:3000/produtos",
						data: oPayloadStockControl,

						success: function (oResponse) {
							debugger
							that.selectProdTable()
						},
						error: function (oResponse) {
							debugger
						}
					});

				},
				error: function (oResponse) {
					debugger
				}
			});

		},

		onPressSales: function (evt) {
			debugger
			var that = this;
			this.getView().byId("nameSale").setEnabled(true);
			var aItemVendaAtual = this.getView().getModel("ModelItemVenda").getData().aItemVenda;
			var oFieldClientComboBox = this.getView().byId("nameSale")
			var oCreateData = new Date();
			var oPostSale = {
				"client_id_cli": oFieldClientComboBox.getSelectedKey(),
				"gross_amount_sl": window.sValorTotalVenda,
				"creationdate_sl": oCreateData.toISOString().slice(0, 10),
			}
			var sTotalItemVenda = aItemVendaAtual.length;
			var sCount = 0;


			// Inserindo um nova Venda
			$.ajax({
				type: "POST",
				url: "http://localhost:3000/vendas/sale",
				data: oPostSale,

				success: function (oResponse) {
					debugger
					var idSale = oResponse.sale_id;

					aItemVendaAtual.forEach(oItemVenda => {
						debugger
						var oItemSale = {

							"product_id_product_pdt": oItemVenda.sProduto,
							"sale_id": idSale,
							"quantity_item": oItemVenda.sQuantidade,
							"price_item": oItemVenda.sPrecoUnitario
						}

						that.StockControlSale(oItemVenda.sProduto, oItemVenda.sQuantidade);
						$.ajax({
							type: "POST",
							url: "http://localhost:3000/itensVendas/sale_item",
							data: oItemSale,

							success: function (oResponse) {
								debugger

								sCount++


								if (sCount == sTotalItemVenda) {

									that.clearFormInputSaleFinal();
									that.getView().getModel("ModelItemVenda").setProperty("/aItemVenda", []);
									MessageToast.show("Venda Inserida com Sucesso");
									that.selectSalesTable()
								};


							},
							error: function (oResponse) {
								debugger
							}
						})
					})

				},

				error: function (oResponse) {
					debugger
				},

			});

		},

		initModelItemVenda() {
			var that = this;

			var oModelItemVenda = {
				aItemVenda: []
			};


			var oModelItemVenda = new JSONModel(oModelItemVenda);

			that.getView().setModel(oModelItemVenda, "ModelItemVenda");
		},

		onPressItemSale: function (oEvent) {
			debugger
			var that = this;

			var oLinhaClicadaSale = oEvent.getSource().getBindingContext("modelVenda").getProperty();
			var sIdSaleOrder = oLinhaClicadaSale.sale_id;
			var oModelVendaDialog = new JSONModel();
			that.getView().setModel(oModelVendaDialog, "modelVendaDialog");

			$.ajax({
				type: "GET",
				url: "http://localhost:3000/itensVendas/itens/" + sIdSaleOrder,

				success: function (oResponse) {
					debugger
					that.getView().getModel("modelVendaDialog").setProperty("/", oResponse.response);

					if (!oDialogSale) {
						var oDialogSale = new sap.m.Dialog({
							title: "Itens da Venda",
							contentWidth: "550px",
							contentHeight: "300px",
							content: new List({
								items: {
									path: "modelVendaDialog>/",
									template: new StandardListItem({
										title: "{modelVendaDialog>name_pdt}",
										description: "R${modelVendaDialog>price_item}",
										counter: "{modelVendaDialog>quantity_item}"
									})
								}
							}),
							endButton: new Button({
								text: "Fechar",
								press: function () {
									oDialogSale.close();
								}.bind(that)
							})
						});

						//to get access to the controller's model
						that.getView().addDependent(oDialogSale);
					}

					oDialogSale.open();


				},
				error: function (oResponse) {
					debugger
				}
			});


		},

		//FILTRO DE DATA - VENDAS
		openDateRangeSelection: function (oEvent) {
			debugger
			this.getView().byId("SaleDRS").openBy(oEvent.getSource().getDomRef());
		},

		changeDateSales: function (oEvent) {
			debugger
			var that = this;
			if (oEvent.getSource().getDateValue() == "" || oEvent.getSource().getSecondDateValue() == null) {
						MessageToast.show("Inserir data")
		
						return
					};
			var aData = oEvent.getSource().getSecondDateValue().toLocaleDateString().split('/');
			var sDataFinalFormatoBanco = aData[2] +'-'+aData[1]+'-'+aData[0];
			var oDataPayload ={

				"sDataInicio" : oEvent.getSource().getDateValue().toISOString().slice(0, 10),
				"sDataFinal" : sDataFinalFormatoBanco
				};
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/vendas/filterDate",
				data: oDataPayload,
				success: function (oResponse) {
					debugger

				
					var aItenVendas = oResponse.response;

					aItenVendas.forEach(oItemVenda => {
						oItemVenda.creationdate_sl = new Date(oItemVenda.creationdate_sl)

					});

					var oModelVenda = new JSONModel({
						aVenda: aItenVendas
					});

					that.getView().setModel(oModelVenda, "modelVenda");


				},
				error: function (oResponse) {
					debugger
				}
				});


			MessageToast.show("Data escolhida: " + oEvent.getParameter("value"));
		},

		onPressClearFilterSale: function(){
			debugger
			this.getView().byId("SaleDRS").setValue()
			this.selectSalesTable();

		},

		clearFormInputSale: function () {

			//this.getView().byId("nameSale").clearSelection()
			this.getView().byId("ProductSale").clearSelection()
			this.getView().byId("input-p").setValue()
		},

		clearFormInputSaleFinal: function () {

			this.getView().byId("nameSale").clearSelection()
			this.getView().byId("ProductSale").clearSelection()
			this.getView().byId("input-p").setValue()
		},

		onPressNewProduct: function (evt) {
			debugger
			var oFieldClientComboBox = this.getView().byId("nameSale")
			var oFieldProductComboBox = this.getView().byId("ProductSale")
			var oFieldQtdeComboBox = this.getView().byId("input-p")

			if (oFieldClientComboBox.getSelectedKey() == "" || oFieldClientComboBox.getSelectedKey() == null) {
				MessageToast.show("Campo Cliente Obrigatório")

				return
			};

			if (oFieldProductComboBox.getSelectedKey() == "" || oFieldProductComboBox.getSelectedKey() == null) {
				MessageToast.show("Campo Produto Obrigatório")

				return
			};

			if (oFieldQtdeComboBox.getValue() == "" || oFieldQtdeComboBox.getValue() == null) {
				MessageToast.show("Campo Quantidade Obrigatório")

				return
			}

			var oCreateData = new Date();
			var that = this;
			debugger
			var sIdCli = oFieldClientComboBox.getSelectedKey();
			var sCliNome = oFieldClientComboBox.getValue();
			var sIdProduct = oFieldProductComboBox.getSelectedKey();
			var sProdNome = oFieldProductComboBox.getValue();
			var sQtd = oFieldQtdeComboBox.getValue();
			var sPreco = oFieldProductComboBox.getValue();
			var aPrecoSplit = sPreco.split("-");
			var sValor = aPrecoSplit[1];
			var sPrecoClean = parseFloat(sValor.replace(" R$", ""))

			var sPrecoFinal = (sPrecoClean * sQtd);
			window.sValorTotalVenda = window.sValorTotalVenda + sPrecoFinal


			var oItemVenda = {
				sCliente: sIdCli,
				sClienteNome: sCliNome,
				sProduto: sIdProduct,
				sProdutoNome: sProdNome,
				sQuantidade: sQtd,
				sPrecoFinal: sPrecoFinal,
				sPrecoUnitario: sPrecoClean,
			}

			var aItemVendaAtual = this.getView().getModel("ModelItemVenda").getData().aItemVenda;

			aItemVendaAtual.push(oItemVenda);

			this.getView().getModel("ModelItemVenda").setProperty("/aItemVenda", aItemVendaAtual);

			this.getView().getModel("ModelItemVenda").refresh();

			that.clearFormInputSale();

			that.fieldClientComboBox();

		},

		fieldClientComboBox: function () {

			this.getView().byId("nameSale").setEnabled(false);

		},

		removeItemFromArrayByIndex(sIndexToRemove, aItemVenda) {
			for (let i = 0; i < aItemVenda.length; i++) {
				if (i === sIndexToRemove) {
					aItemVenda.splice(i, 1);
				}
			}

			return aItemVenda;
		},

		onPressDeleteSale: function (oEvent) {


			var oModelItemVenda = this.getView().getModel("ModelItemVenda");

			var aItemVendaAtual = this.getView().getModel("ModelItemVenda").getData().aItemVenda;

			var item = oEvent.getSource().getBindingContext("ModelItemVenda").getPath();

			var idx = parseInt(item.substring(item.lastIndexOf('/') + 1), 10);

			var aItemVendaItemDeletado = this.removeItemFromArrayByIndex(idx, aItemVendaAtual)

			oModelItemVenda.setProperty("/aItemVenda", aItemVendaItemDeletado);

			this.getView().getModel("ModelItemVenda").refresh();

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

		//FILTRO DE DATA - CAIXA
		openDateRangeSelectionTwo: function (oEvent) {
			this.getView().byId("TotalDRS").openBy(oEvent.getSource().getDomRef());
		},

		changeDateTotal: function (oEvent) {
			debugger
			var that = this;
			var aDataCaixa = oEvent.getSource().getSecondDateValue().toLocaleDateString().split('/');
			var sDataFinalFormatoBancoCaixa = aDataCaixa[2] +'-'+aDataCaixa[1]+'-'+aDataCaixa[0];
			var oDataCaixaPayload ={

				"sDataInicioCaixa" : oEvent.getSource().getDateValue().toISOString().slice(0, 10),
				"sDataFinalCaixa" : sDataFinalFormatoBancoCaixa
				};
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/vendas/filtroCaixa",
				data: oDataCaixaPayload,
				success: function (oResponse) {
					debugger

					var sCaixa = oResponse.response[0].valorTotal;

					that.getView().getModel("modelCaixa").setProperty("/sCaixa", sCaixa);


				},
				error: function (oResponse) {
					debugger
				}
				});

				$.ajax({
					type: "GET",
					url: "http://localhost:3000/vendas/FiltroVendasCaixa",
					data: oDataCaixaPayload,
					success: function (oResponse) {
						debugger
	
						var sVendas = oResponse.response[0].vendasTotal;
	
						that.getView().getModel("modelCaixa").setProperty("/sVendas", sVendas);
	
	
					},
					error: function (oResponse) {
						debugger
					}
					});

			
			MessageToast.show("Data escolhida: " + oEvent.getParameter("value"));
		},

		onPressClearFilterCashier: function(){
			debugger
			this.getView().byId("TotalDRS").setValue();
			this.selectTotalSalesCash();
			this.selectTotalSales();

		},

		
	
	});
});