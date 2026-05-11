const notesImages = {
"DO":"Images/DO.png","DOC":"Images/DOC.png","DOD":"Images/DOD.png","DODA":"Images/DODA.png","DOA":"Images/DOA.png","DOCA":"Images/DOCA.png","DOAA":"Images/DOAA.png",
"FA":"Images/FA.png","FAC":"Images/FAC.png","FAD":"Images/FAD.png","FADA":"Images/FADA.png","FADG":"Images/FADG.png","FAA":"Images/FAA.png","FACA":"Images/FACA.png",
"LA":"Images/LA.png","LAC":"Images/LAC.png","LAD":"Images/LAD.png","LAG":"Images/LAG.png","LACG":"Images/LACG.png","LADA":"Images/LADA.png","LADG":"Images/LADG.png","LAA":"Images/LAA.png","LACA":"Images/LACA.png",
"LAB":"Images/LAB.png","LABA":"Images/LABA.png","LABG":"Images/LABG.png",
"MI":"Images/MI.png","MIC":"Images/MIC.png","MIA":"Images/MIA.png","MICA":"Images/MICA.png","MIB":"Images/MIB.png","MIBA":"Images/MIBA.png",
"RE":"Images/RE.png","REC":"Images/REC.png","RED":"Images/RED.png","REDA":"Images/REDA.png","REA":"Images/REA.png","RECA":"Images/RECA.png","REB":"Images/REB.png","REBA":"Images/REBA.png",
"SI":"Images/SI.png","SIC":"Images/SIC.png","SIA":"Images/SIA.png","SICA":"Images/SICA.png","SIB":"Images/SIB.png","SIBA":"Images/SIBA.png","SIBG":"Images/SIBG.png","SIG":"Images/SIG.png","SICG":"Images/SICG.png",
"SOL":"Images/SOL.png","SOLC":"Images/SOLC.png","SOLD":"Images/SOLD.png","SOLDA":"Images/SOLDA.png","SOLDG":"Images/SOLDG.png","SOLA":"Images/SOLA.png","SOLCA":"Images/SOLCA.png","SOLB":"Images/SOLB.png","SOLBA":"Images/SOLBA.png","SOLBG":"Images/SOLBG.png","SOLG":"Images/SOLG.png","SOLCG":"Images/SOLCG.png"
};

const notes = {
"DO":[],"DOC":[],"DOD":[1,2,3],"DODA":[1,2],"DOA":[],"DOCA":[],"DOAA":[],
"FA":[1],"FAC":[1],"FAD":[2],"FADA":[2],"FADG":[1,2,3],"FAA":[1],"FACA":[1],
"LA":[1,2],"LAC":[1,2],"LAD":[1],"LAG":[1,2],"LACG":[1,2],"LADA":[1],"LADG":[1],"LAA":[1,2],"LACA":[1,2],
"LAB":[2,3],"LABA":[2,3],"LABG":[2,3],
"MI":[1,2],"MIC":[1,2],"MIA":[],"MICA":[],"MIB":[2,3],"MIBA":[2],
"RE":[1,3],"REC":[1,3],"RED":[2,3],"REDA":[2],"REA":[1],"RECA":[1],"REB":[1,2,3],"REBA":[1,2],
"SI":[2],"SIC":[2],"SIA":[2],"SICA":[2],"SIB":[1],"SIBA":[1],"SIBG":[1],"SIG":[2],"SICG":[2],
"SOL":[],"SOLC":[],"SOLD":[2,3],"SOLDA":[2,3],"SOLDG":[2,3],"SOLA":[],"SOLCA":[],"SOLB":[2],"SOLBA":[2],"SOLBG":[1,2,3],"SOLG":[1,3],"SOLCG":[1,3]
};

function formatNoteLabel(noteKey) {
   const baseMap = { DO: 'Do', RE: 'Ré', MI: 'Mi', FA: 'Fa', SOL: 'Sol', LA: 'La', SI: 'Si' };
   const bases = Object.keys(baseMap).sort((a, b) => b.length - a.length);
   const base = bases.find((k) => noteKey.startsWith(k));
   if (!base) return noteKey;

   let label = baseMap[base];
   const suffix = noteKey.slice(base.length);

   for (const char of suffix) {
       if (char === 'C') label += '♮';
       else if (char === 'D') label += '#';
       else if (char === 'A') label += ' Aigu';
       else if (char === 'G') label += ' Grave';
       else if (char === 'B') label += '♭';
   }

   return label;
}