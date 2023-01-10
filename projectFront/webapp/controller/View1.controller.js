sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"

    
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, UIComponent) {
        "use strict";

        return Controller.extend("projectbetelgas.controller.View1", {
            onInit: function () {

               

            },

            onPressLogin: function(oEvent){
                debugger
                var that = this;
                var oInputUsuario = that.getView().byId("emailInput")
                var oInputSenha = that.getView().byId("passwordInput")
    
                if (oInputUsuario.getValue() == "" || oInputUsuario.getValue() == null) {
                    MessageToast.show("Campo Email Obrigatório")
    
                    return
                };
                if (oInputSenha.getValue() == "" || oInputSenha.getValue() == null) {
                    MessageToast.show("Campo Senha Obrigatório")
    
                    return
                };

                
                var oLoginPayload ={

                    "sUserValidate" : oInputUsuario.getValue() ,
                    "sPasswordValidade" : oInputSenha.getValue() 
                    };

                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/usuarios/validate",
                    data: oLoginPayload,
        
                        success: function (oResponse) {
                            debugger
                            var oRouter = UIComponent.getRouterFor(that);

                            if (oResponse.response.length >0) 
                            { 
                                window.HotDog = true;
                                oRouter.navTo("RouteView2");
                                
                                
                            } else {
                                 MessageToast.show("Verfique se a Senha e o Usuário estão corretos")
                                
                            }
                        },
                        error: function (oResponse) {
                            debugger
                        }
                    });
    
    
            },
        });
    });
