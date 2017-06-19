

module.exports = function (emsg, utils) {

		function generalCall(error, result, response) {
				if(error){
						var obj = emsg.dberror;
						if(error.code == "11000" || error.code == "11001") {
								obj = emsg.duplicateData;
						} else {
								obj.message = error.toString();
						}
						response.status(obj.status).send(obj);
				} else if(!result && result!=0){
						response.status(emsg.noData.status).send(emsg.noData);
				} else {
						var resTmp = utils.clone(result);
						response.send(resTmp);
				}
		}

		function validateFields() {
				var data = arguments[0], names = arguments.length, name;
				if (typeof data !== "object") {
						return false;
				} else {
					for (var i = 1; i < names; i++) {
							name = arguments[i];
							if (data[name] === undefined) {
									return false;
							}
					}
					return true;
				}
		}
		return {
				gCall : generalCall,
				checkFields : validateFields
		}
}
