import React, { useState } from 'react';

function TranscriptFormatterUI() {
  const [rawText, setRawText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const promptInstruction = `
You are an expert medical-legal transcription editor.
Your task is to transform raw French dictation into a polished, continuous, professionally written medico-legal narrative while preserving every medically meaningful detail exactly as provided.

Follow these instructions strictly and without exception:

General Rules

Do not add any new information.

Remove filler words, repeated segments, false starts, and transcription artifacts (“euh”, “virgule”, hesitations, duplicates, etc.).

Correct all spelling, grammar, conjugation, and medical terminology errors.

Correct obvious medical misspellings (ex. “Longo sacré” → “lombo-sacré”).

Maintain the exact chronological order of all events.

Write in continuous narrative paragraphs—no lists, no headings, no bold text.

Always a blank space before and after french quotation marks << >>

Use a formal, neutral, medico-legal tone appropriate for CNESST, insurance, and expert reports.

Standardize all dates as: “19 avril 2024”.

Do not summarize, reinterpret, or omit any clinically relevant detail.

Narrative Structure Rules

Begin with the incident description.

Then present each medical consultation in chronological order.

Introduce each imaging exam with a natural lead-in sentence (ex.: “Une radiographie de… est réalisée…”).

Place all imaging or specialist findings in French quotation marks (« … »).

Continue with each follow-up visit chronologically.

Write one complete paragraph per event or per date.

DICTATION FORMATTING (CRITICAL)

The worker’s original accident dictation must follow all the rules below:

The dictation (« … ») must appear as a completely separate paragraph, with:

one blank line before,

one blank line after,

no other text in the same paragraph.

When introducing the dictation, write a sentence such as:
“La fiche de réclamation décrit l’événement suivant :”
Then start a new paragraph and place the dictation alone between French quotation marks (« … »).

Never merge the dictation paragraph with the sentence introducing it.

Never place the dictation on the same line as the introduction sentence.

Never insert additional narrative sentences inside the dictation paragraph.

Output Requirements

Output only the final formatted medico-legal narrative.

No commentary, no explanations, no bullet points, no headings.

The final result must read like a professional medico-legal report with clean spacing and paragraphs.
`;

  const handleFormat = async () => {
    setFormattedText(''); // Clear output immediately
    if (!rawText.trim()) {
      setFormattedText('Please enter a raw transcript to format.');
      return;
    }

    setLoading(true);
    setStatus('Call the server');

    try {
      const res = await fetch("http://localhost:5001/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: promptInstruction +'\n\n' + rawText 
        }),
      });

      if(!res.ok){
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setFormattedText(data.result || '');
      setStatus('Formatage termine');
    } catch (error) {
      console.error(error);
      setStatus("Erreur lors de lappel au serveur");
      setFormattedText('');
    } finally {
      setLoading(false);
    }
  };

    const handleClear = () => {
    setRawText('');
    setFormattedText('');
    setStatus(null);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', fontFamily: 'system-ui' }}>
      <h1>Transcript Medico-Légal – Formatter</h1>
      <p>Collez le texte brut, puis laissez l’IA produire la version formatée.</p>

      <h3>Transcript brut</h3>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={10}
        style={{ width: '100%', marginBottom: '8px' }}
      />

      <button onClick={handleFormat} disabled={loading} style={{ marginBottom: '16px' }}>
        {loading ? 'Formatage…' : 'Formatter le transcript'}
      </button>

      <button
        onClick={handleClear}
        disabled={loading}
        style={{ margin: '10px 0' }}>
        Clear
    </button>

      {status && <p>{status}</p>}

      <h3>Transcript formaté</h3>
      <textarea
        value={formattedText}
        readOnly
        rows={10}
        style={{ width: '100%', whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}

export default TranscriptFormatterUI;
