sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel"

], function (MessageToast, Controller, Log, JSONModel) {
	"use strict";

	return Controller.extend("projectbetelgas.controller.View2", {

		onInit() {

			var oDataSetModel = {


				aNome: [
					{
						nome: "Aluizio", sobrenome: "Antonio", telefone: "11 952096999", endereço: "Rua Curitiba, 48", cep: "07261-070", tempoDeConsumo: "60 dias"
					},
					{
						nome: "José", sobrenome: "Silva", telefone: "11 952059908", endereço: "Rua Guapo, 85", cep: "07252-090", tempoDeConsumo: "45 dias"
					}
				]


			}

			var oDataSetModelProd = {

				aProduto: [
					{
						produto: "Botijão Gás GLP", descricao: "Gás Liquefeito de Petróleo P13", preco: "110R$", quantidadeEstoque: "62"
					}
				]


			}

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

			var oModel = new JSONModel(oDataSetModel);
			var oModelProd = new JSONModel(oDataSetModelProd);
			var oModelVenda = new JSONModel(oDataSetModelVenda);
			var oModelEstoque = new JSONModel(oDataSetModelEstoque);
			var oModelCaixa = new JSONModel(oDataSetModelCaixa);

			this.getView().setModel(oModel, "modelCliente");
			this.getView().setModel(oModelProd, "modelProd");
			this.getView().setModel(oModelVenda, "modelVenda");
			this.getView().setModel(oModelEstoque, "modelEstoque");
			this.getView().setModel(oModelCaixa, "modelCaixa");
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

		onPress: function (evt) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
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