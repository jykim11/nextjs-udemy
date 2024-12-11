"use client";

import Editor from "@monaco-editor/react";
import { Snippet } from "@prisma/client";
import { useState } from "react";
import * as actions from "@/actions";

interface SnippetEditFormProps {
	snippet: Snippet;
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
	const [code, setCode] = useState(snippet.code);

	const handleCodeChange = (value: string = "") => {
		setCode(value);
	};

	const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);

	return (
		<div>
			<Editor
				value={code}
				theme="vs-dark"
				height="40vh"
				defaultLanguage="typescript"
				defaultValue={code}
				onChange={handleCodeChange}
				options={{
					minimap: { enabled: false },
				}}
			/>
			<form action={editSnippetAction}>
				<button
					type="submit"
					className="p-2 border rounded bg-blue-500 text-white"
				>
					Save
				</button>
			</form>
		</div>
	);
}
