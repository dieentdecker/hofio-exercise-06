sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/base/Log"
], function (Controller, History, Log) {
	"use strict";

	return Controller.extend("at.clouddna.training.FioriDeepDive.controller.BaseController", {
		onNavBack: function () {
			let oPreviousHash = History.getInstance().getPreviousHash();

			if (oPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Master", {}, true);
			}
		},

		logDebug: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.debug("DEBUG - " + sMessage);
		},

		logError: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.error("ERROR - " + sMessage);
		},

		logFatal: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.fatal("FATAL - " + sMessage);
		},

		logInfo: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.info("INFO - " + sMessage);
		},

		logTrace: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.trace("TRACE - " + sMessage);
		},

		logWarning: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.warning("WARNING - " + sMessage);
		},

		getRouter: function () {
			this.setContentDensity();

			sap.ui.getCore().getMessageManager().removeAllMessages();
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		setContentDensity: function () {
			this.getView().addStyleClass(this.getContentDensityClass());
		},

		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return "sapUiSizeCompact";
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		geti18nText: function (sId, aParams) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			return oBundle.getText(sId, aParams);
		}
	});
});