
module.exports = function () {

		function getUniqueDocuments(query, uniqueId, sort, defKeys) {
				var sort = {},aggList = [{ $match : query}],
        group = {}, project = {};
				group._id = ("$").concat(uniqueId || "id");
				if (typeof sort === "Object") {
					sort.$sort = sort;
				}

        for (var i = 0; i < defKeys.length; i++) {
          var key = defKeys[i];
          group[key] = { "$first" : '$' + key};
          project[key] = "$" + key;
        }
        aggList.push({$group : group});
        aggList.push({$project : project});
				return aggList;
		}

		function getUniqueCount(parm) {
			return  [
				{ $match : {user : ""}},
				{ $group : { _id : ("$" + parm), total : { $sum : 1 } } },
			]
		}

		return {
			getUnique : getUniqueDocuments,
			getUniqueCount : getUniqueCount
		}
}
