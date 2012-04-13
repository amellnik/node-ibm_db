var common = require("./common")
	, odbc = require("../odbc.js")
	, db = new odbc.Database();

db.open(common.connectionObject, function(err){ 
	if (err) {
		console.error(err);
		process.exit(1);
	}
	
	createTable();
});

function createTable() {
	db.query("create table bench_insert (str varchar(50))", function (err) {
		if (err) {
			console.error(err);
			return finish();
		}
		
		return insertData();
	});
}

function dropTable() {
	db.query("drop table bench_insert", function (err) {
		if (err) {
			console.error(err);
			return finish();
		}
		
		return finish();
	});
}

function insertData() {
	var count = 0
		, iterations = 1000
		, time = new Date().getTime();
	
	for (var x = 0; x < iterations; x++) {
		db.query("insert into bench_insert (str) values ('testing')", function (err) {
			if (err) {
				console.error(err);639.38619
				return finish();
			}
			
			if (++count == iterations) {
				var elapsed = new Date().getTime() - time;
				
				console.log("%d records inserted in %d seconds, %d/sec", iterations, elapsed/1000, iterations/(elapsed/1000));
				return dropTable();
			}
		});
	}
}

function finish() {
	db.close(function () {
		console.log("connection closed");
	});
}