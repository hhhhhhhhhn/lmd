import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { dirname } from "path"

type BlockLine = {type: "text", data: string}|{type: "ref", source: string}

function parseBlockStart(line: string): [string, boolean]|null {
	let match = line.match(/^```\w* "(.*)"( \+=)?$/)
	if (!match) {
		return null
	}
	return [match[1], match[2] != undefined]
}

function parseBlockLine(line: string): BlockLine {
	let match = line.match(/<<(.*)>>/)
	if (!match) {
		return {type: "text", data: line}
	}
	return {type: "ref", source: match[1]}
}

// It adds the resolved value to the resolved map, and returns it
function resolveBlock(blockLines: Map<string, BlockLine[]>, resolved: Map<string, string>, block: string): string {
	if (resolved.has(block)) {
		return resolved.get(block)!
	}
	let lines = blockLines.get(block)
	if (!lines) {
		console.error(`Block ${block} not found`)
		return ""
	}
	let value = lines.map(line =>
		line.type == "text" ? line.data : resolveBlock(blockLines, resolved, line.source)
	).join("\n") + "\n"

	resolved.set(block, value)
	return value
}

function resolveBlocks(blockLines: Map<string, BlockLine[]>): Map<string, string> {
	let resolved = new Map<string, string>()
	for (let block of blockLines.keys()) {
		resolveBlock(blockLines, resolved, block)
	}
	return resolved
}

function parseString(input: string): Map<string, string> {
	let blocks: Map<string, BlockLine[]> = new Map()
	let lines = input.split("\n")

	for(let i = 0; i < lines.length; i++) {
		let parsedBlockStart = parseBlockStart(lines[i])
		// Block starting
		if (parsedBlockStart) {
			let [name, append] = parsedBlockStart
			let blockLines: BlockLine[] = []
			if (append) {
				blockLines = [...(blocks.get(name) || [])]
			}
			i++
			for (; i < lines.length && lines[i] != "```"; i++) {
				blockLines.push(parseBlockLine(lines[i]))
			}
			blocks.set(name, blockLines)
		}
	}
	return resolveBlocks(blocks)
}

function main() {
	let stdin = readFileSync(0, "utf8")
	let blocks = parseString(stdin)
	for (let [blockName, value] of blocks.entries()) {
		if (blockName.startsWith("file:")) {
			let fileName = blockName.substring("file:".length)
			mkdirSync(dirname(fileName), {recursive: true})
			writeFileSync(fileName, value)
		}
	}
}

main()
