import glomp from "glomp";

const isJsFile = glomp
	.withExtension(".js")
	.or(glomp.withExtension(".mjs"))
	.or(glomp.withExtension(".jsx"))
	.or(glomp.withExtension(".ts").andNot(glomp.withExtension(".d.ts")))
	.or(glomp.withExtension(".tsx"));

const isDotSpecOrDotTest = glomp.withNameMatchingRegExp(
	/\.(spec|test)\.[\w\-]+$/
);

const testFilesMatcher = isJsFile
	.and(isDotSpecOrDotTest)
	.or(isJsFile.and(glomp.withAbsolutePathMatchingRegExp(/__tests__/)))
	.andNot(glomp.withAbsolutePathMatchingRegExp(/node_modules/));

export default testFilesMatcher;
