export function removeMarkdown(text: any, excludeComments: boolean) {
	let plaintext = text
		.replace(/`\$?=[^`]+`/g, "") //inline dataview
		.replace(/^---\n.*?\n---\n/s, "") //YAML Header
		.replace(/\!?\[(.+)\]\(.+\)/g, "$1") //URLs & Image Captions
		.replace(/\*|_|\[\[|\]\]|\||==|~~|---|#|> |`/g, ""); //Markdown Syntax

	if (excludeComments)
		plaintext = plaintext
			.replace(/<!--.*?-->/gs, "") //HTML comments
			.replace(/%%.*?%%/gs, "");
	//Obsidian comments
	else plaintext = plaintext.replace(/%%|<!--|-->/g, ""); //remove only comment syntax

	return plaintext;
}

export function removeFootnotes(text: any) {
	return text
		.replace(/^\[\^\w+\]:.*$/gm, "") //footnote at the end
		.replace(/\[\^\w+\]/g, ""); //footnote reference inline
}
