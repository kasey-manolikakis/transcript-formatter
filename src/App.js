import React, { useState } from 'react';
//import prompts from './prompts.json';

function TranscriptFormatterUI() {
  const [rawText, setRawText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  

   const promptInstruction = 
`You are an expert medical-legal transcription editor. Your task is to transform raw French dictation into a polished, professionally formatted medico-legal narrative while preserving all medically relevant content exactly as provided.

Follow these rules strictly and without exception:

## 1. Content Rules
- Do not add any new information.  
- Remove filler words, repeated phrases, hesitations, and dictation artifacts (“euh”, “virgule”, etc.).  
- Correct all spelling, grammar, conjugation, and medical terminology errors.  
- Infer correct medical terms only when the dictation clearly contains a misspelling.  
- Maintain strict chronological order.  
- Use a formal medico-legal tone suitable for CNESST and insurance reports.  
- Standardize all dates as: 19 avril 2024.  

---

## 2. Paragraph Structure (MANDATORY)

### A. Dictation blocks
- Any text representing the worker’s original words must be placed in French quotation marks (« … »).  
- Dictation blocks must always be their own separate paragraph.  
- Always insert:
  - 1 blank line before the dictation paragraph  
  - 1 blank line after the dictation paragraph  
- Never merge dictation with any other paragraph.

### B. One paragraph per event
Every distinct event must be its own paragraph with a blank line above it, including:
- every new date  
- every consultation  
- every diagnosis  
- every imaging exam  
- every imaging interpretation  
- every specialist or radiologist finding  
- every follow-up visit  
- every new medical conclusion  

Never merge multiple events, dates, or findings into a single paragraph.  
Every event = its own paragraph.

### C. Imaging findings
- Introduce each imaging exam with a lead-in sentence such as:  
  “Une radiographie de… est réalisée…”  
- Place all radiology or specialist findings inside French quotation marks (« … »).  
- Imaging findings must also be their own separate paragraph with blank lines around them.

---

## 3. Output Formatting (MANDATORY)
Your output must always:
- consist of clean paragraphs separated by blank lines  
- include no headings  
- include no lists  
- include no bold text  
- include no commentary or explanations  

Output only the final formatted medico-legal narrative.

Example of how a raw text needs to be formatted

Raw text:

la fiche de réclamation du travailleur décrit l'événement suivant survenu le 19 avril 2024 - 
mon aide virgule nous étions en train de décharger un lit d'hôpital de 300 400 livres de la boîte de 
camion sur une terre gate j'ai vu le lit glisser vers moi il y avait euh eu de béton en arrière de moi 
j'ai eu peur de me faire coincer entre le mur et le lit j'ai sauté en bas de la terre de 4 pieds de haut 
et je me suis fait mal au dos ça va à la rencontre de docteur Sonia le 19 avril 2024 elle diagnostique 
un trauma dorsaux lombaire et pour droite elle ne prescrit des radiographies un scan Longo sacré et 
prescrit un arrêt de travai l le travaille encore en compte le docteur Leclerc le 3 juin 2024 le 
diagnostics de construction dorceaux lombaire et épaule droite il le maintient dans le travail et 
prescrit de la physiothérapie je travaille à la rencontre le docteur Leclerc le 4 juillet 2024 il le 
diagnostic est une conclusion dorsaux lombaire il maintient les traitements en physiothérapie et l'arrêt
 de travail le travailleur Leclerc le 1er août 2024 et le diagnostic qu'il contient lombaire et un 
 syndrome douloureux résiduel il prescrit de la physiothérapie au besoin et un retour au travail 
 progressif avec tâches déjà Leclerc le 3 septembre 2024 et juge la condition clinique stable et 
 note que le travail est attaque à conduire le camion mais ne peut manipuler de charge point incroyable 
 incroyable 28 octobre 2024 il note un syndrome douloureux et le prescrit des blocs à cet air L4 L5 et 
 L55 bilatérale et clinique stable.ca voilà radiographie de la colonne Lambert le 6 août 2024 elle était 
 interprétée par le docteur Claudine Deshaies radiologiste cette dernière constate évidemment 
 ostéopathique entérolatéral est âgé est connu virgule plus marqué en l2l3 point pencement dégénératifs 
 modéré en L55 cette trouvaille m'apparaissent à échanger par rapport à des films récents d'avril 2024 
 là tu es légèrement qualifié il y a un peu plus d'arthrose à cet arbre alors ok le radiographie de 
 l'épaule droite le 19 avril 2024 elle était interprétée par le docteur Marie-Josée berthiaule 
 radiologiste et pour le droite microscalification à l'en-tête de l'impact pneus versus le petit 
 rond au niveau de la tête libérale postérieure sur l'incidence latérale ceci allumé métrique je ne 
 perçois pas de changement cellulaire et qui est hétérogénéité de la grosse liberté sur fond probablement 
 de tantinopathie chroniques libéral est préservée pas d'attraction objectivé la communauté un petit peu
  dégénérative sans plus il y a un petit éperon sous la première et l'établi le tout suggérable un 
  certain accrochage et ou une toxopathie quoi 19 avril 2019

  Formatted text: 

  La fiche de réclamation du travailleur décrit l'événement suivant survenu le 19 avril 2024 :

« Moi et mon aide, nous étions en train de décharger un lit d'hôpital de 300-400 lbs de la boite du camion sur une tail gate. J'ai vu le lit glisser vers moi et il y avait un mur de béton en arrière de moi, j'ai eu peur de me faire coincer entre le mur et le lit, j'ai sauté en bas de la tail gate de 4 pieds de haut et je me suis fait mal au dos. »

Le travailleur consulte le docteur Sonia Silvano, le 19 avril 2024. Elle diagnostique un traumatisme dorso-lombaire et à l'épaule droite. Elle prescrit des radiographies, un scan lombo-sacré et un arrêt de travail.

Une radiographie de l'épaule droite est réalisée le 19 avril 2024. Elle est interprétée par le docteur Marie-Josée Berthiaume, radiologiste. Elle constate :

« Microscalcifications à l’enthèse du supra-épineux versus le petit rond au niveau de la tête humérale postérieure sur l'incidence latérale. Ceci est millimétrique. Je ne perçois pas de changement similaire, bien qu’il y a une hétérogénéité de la grosse tubérosité sur fond probablement de tendinopathie chronique. 
L’alignement glénohuméral est préservé. Pas de fracture ou luxation objectivée. L'acromioclaviculaire est un petit peu dégénératif sans plus. Il y a un petit éperon sous-acromial bien établi, le tout suggérant un certain accrochage et/ou une tendinopathie de la coiffe. »

Le travailleur rencontre le docteur Leclair le 3 juin 2024. Il maintient les diagnostics de contusion dorso-lombaire et à l'épaule droite. Il prescrit de la physiothérapie et un arrêt de travail.

Le travailleur revoit le docteur Leclair, le 4 juillet 2024. Il maintient le diagnostic de contusion dorso-lombaire. Il maintient les traitements en physiothérapie et l'arrêt de travail.

Le travailleur revoit le docteur Leclair, le 1er août 2024. Il maintient le diagnostic de contusion lombaire et ajoute un syndrome douloureux résiduel. Il prescrit de la physiothérapie au besoin et un retour au travail progressif avec tâches légères.

Une radiographie de la colonne lombaire est réalisée le 6 août 2024. Elle est interprétée par le docteur Claudine Deshaies, radiologiste. Cette dernière constate :

« Proéminences ostéophytiques antéro-latérales étagées connues, plus marqués en L2-L3. Pincements dégénératifs modérés en L5-S1. Ces trouvailles m'apparaissent inchangées par rapport à des films récents d'avril 2024. 

L'aorte est légèrement calcifiée. Il y a un peu d’arthrose facettaire en lombaire inférieur. »

Le travailleur revoit le docteur Leclair, le 3 septembre 2024. Il juge la condition clinique stable et note que le travailleur est apte à conduire un camion mais ne peut manipuler de charges lourdes.

Le travailleur revoit le docteur Leclair, le 28 octobre 2024. Le docteur Leclair note un syndrome douloureux et prescrit des blocs facettaires L4-L5 et L5-S1 bilatéraux. Il juge la condition clinique est stable.

Le travailleur revoit le docteur Leclair, le 8 janvier 2025. Il maintient le diagnostic de syndrome douloureux chronique lombaire post-traumatique et juge la condition clinique détériorée. Il prescrit des blocs facettaires et maintient les travaux légers de chauffeur avec des manipulations de charges légères. Il réfère le travailleur en physiatrie et psychologie.

Le docteur Leclair produit une information médicale complémentaire écrite, le 6 mars 2025. Il note une persistance du syndrome douloureux lombaire et que le travailleur est en attente de bloc facettaire lombaire et d’un rendez-vous en physiatrie. Il ne consolide pas le travailleur.

Le travailleur revoit le docteur Leclair, le 17 mars 2025. Il note une condition clinique stable. Il ajoute du Cymbalta et note un arrêt complet de travail de 15 jours post-bloc facettaire.


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
        rows={20}
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
        rows={20}
        style={{ width: '100%', whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}

export default TranscriptFormatterUI;
