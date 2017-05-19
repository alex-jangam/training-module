module.exports = {
	"invalidToken":{"status":400,"message":"Session has expired, please re-login"},
	"wrongToken":{"status":400,"message":"Please provide a valid token."},
	"invalidCred":{"status":400,"message":"Invalid Username or Password."},
	"unauthorized":{"status": 401, "message":"Sorry, you do not have permissions to do this operation"},
	"duplicateuser":{"status":409,"message":"User already exists"},
	"noData":{"status": 200,"message":"no content"},
	"invalidData":{"status":406, "message":"Invalid or incomplete data"},

}
