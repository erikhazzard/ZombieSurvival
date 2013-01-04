#some pretty print stuff
DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔\033[39m
HR= ==================================================

#Manually specify the third party libs to include
THIRD_PARTY = \
	static/lib/underscore.js \
	static/lib/json2.js \
	static/lib/jquery.js \
	static/lib/backbone.js

# ---------------------------------------
# Third party file build step
# ---------------------------------------
third:
	@echo "${HR}\n"
	@echo "Compiling Third Party JS"
	@cat  $(THIRD_PARTY) > static/lib/all3rdjs.js
	@./node_modules/uglify-js/bin/uglifyjs -nc static/lib/all3rdjs.js > static/lib/all3rdjs.min.js
	@rm static/lib/all3rdjs.js
	@echo "Third party files successfully built at ${DATE}."
