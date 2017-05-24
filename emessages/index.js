module.exports = {
	"invalidToken":{"status":401,"message":"Session has expired, please re-login"},
	"wrongToken":{"status":401,"message":"Please provide a valid token."},
	"invalidCred":{"status":401,"message":"Invalid Username or Password."},
	"unauthorized":{"status": 401, "message":"Sorry, you do not have permissions to do this operation"},
	"duplicateuser":{"status":409,"message":"User already exists"},
	"duplicateData":{"status":409,"message":"Duplicate Data"},
	"noData":{"status": 200,"message":"no content"},
	"invalidData":{"status":406, "message":"Invalid or incomplete data"},

}
