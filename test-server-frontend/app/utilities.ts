
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}


export interface ChatCompletion {
    messages: ChatMessage[];

}

export function simpleMarkdownToHtml(markdownText: string): string {
  let html = markdownText;

  // 1. Handle code blocks (```language ... ```) - simplified
  // This is a basic pattern and might not handle nesting/complex cases perfectly,
  // but it works for standard LLM code output.
  html = html.replace(/```(\w*)\s*([\s\S]*?)```/g, (match, lang, code) => {
    const languageClass = lang ? `language-${lang}` : '';
    // Use Prettier-like formatting: bg-gray-700, text-white, overflow-x-auto
    return `<pre class="p-2 my-2 rounded-md bg-gray-800 text-white overflow-x-auto"><code class="${languageClass}">${code.trim()}</code></pre>`;
  });

  // 2. Bold (**text** or __text__)
  html = html.replace(/\*\*([^\*]+)\*\*|__([^_]+)__/g, '<strong>$1$2</strong>');

  // 3. Italics (*text* or _text_)
  html = html.replace(/\*([^\*]+)\*|_([^_]+)_/g, '<em>$1$2</em>');

  // 4. Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:text-blue-300">$1</a>');

  // 5. Convert newlines to <br> for simple paragraph breaks
  // Must be done after code block handling
  html = html.replace(/\n/g, '<br>');
  
  return html;
}