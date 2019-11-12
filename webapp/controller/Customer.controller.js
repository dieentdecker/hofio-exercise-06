sap.ui.define([
	"at/clouddna/training/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, MessageBox, History) {
	"use strict";

	return BaseController.extend("at.clouddna.training.FioriDeepDive.controller.Customer", {
		_sMode: "",
		_validInput: true,

		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let sCustomerID = oEvent.getParameter("arguments").customerid,
				editModel = new JSONModel({
					editmode: false
				}),
				oSmartForm = this.getView().byId("customer_smartform");

			this.getView().unbindElement();
			this.setModel(editModel, "editModel");

			oSmartForm.attachEditToggled(function (oEvent) {
				editModel.setProperty("/editmode", oEvent.getParameter("editable"));
			});

			oSmartForm.setEditable(false);
			if (sCustomerID === "create") {
				oSmartForm.setEditable(true);
				this._sMode = "create";
				this.getView().byId("customer_button_cancel").setEnabled(false);
				this._oContext = this.getModel().createEntry("/CustomerSet");
				this.getView().setBindingContext(this._oContext);
				oSmartForm.check();
			} else {
				this._sMode = "display";
				this.getView().byId("customer_button_cancel").setEnabled(true);
				this.getView().bindElement("/CustomerSet(guid'" + sCustomerID + "')");
			}
		},

		onEmailChanged: function (oEvent) {
			let regex =
				/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
				oControl = oEvent.getSource(),
				oValue = oEvent.getParameter("newValue");

			if (regex.test(oValue)) {
				oControl.setValueState("None");
				oControl.setValueStateText("");
			} else {
				oControl.setValueState("Error");
				oControl.setValueStateText(this.geti18nText("validate.email.error"));
			}

		},

		onGenderChanged: function (oEvent) {
			let oValue = oEvent.getParameter("newValue"),
				oControl = oEvent.getSource();

			if (oValue !== "M" && oValue !== "F") {
				oControl.setValueState("Error");
				oControl.setValueStateText(this.geti18nText("validate.gender.error"));
			} else {
				oControl.setValueState("None");
				oControl.setValueStateText("");
			}
		},

		onCancelPress: function (oEvent) {
			let oSmartForm = this.getView().byId("customer_smartform");

			oSmartForm.check();
			if (this._isFormValid()) {
				oSmartForm.setEditable(false);

				if (this.getModel().hasPendingChanges()) {
					this.getModel().resetChanges();
				}
			}
		},

		_isFormValid: function () {
			let oSmartForm = this.getView().byId("customer_smartform"),
				oGroups = oSmartForm.getGroups(),
				oGroupElements = [],
				oElements = [];

			oGroups.forEach(function (oGroup) {
				let oItems = oGroup.getGroupElements();

				oItems.forEach(function (oItem) {
					oGroupElements.push(oItem);
				});
			});

			oGroupElements.forEach(function (oGroupElement) {
				let oItems = oGroupElement.getElements();

				oItems.forEach(function (oItem) {
					oElements.push(oItem);
				});
			});

			return oElements.every(function (oElement) {
				return oElement.getValueState() === "None";
			});
		},

		onSavePress: function (oEvent) {
			let oSmartForm = this.getView().byId("customer_smartform");

			oSmartForm.check();
			if (this._isFormValid()) {
				oSmartForm.setEditable(false);

				if (this.getModel().hasPendingChanges()) {
					this.getModel().submitChanges();

					if (this._sMode === "create") {
						MessageBox.information(this.geti18nText("dialog.create.success"), {
							onClose: function (oEvent) {
								this.onNavBack();
							}.bind(this)
						});
						this.onNavBack();
					} else {
						MessageBox.information(this.geti18nText("dialog.update.success"));
					}
				}
			}
		},
	});
});