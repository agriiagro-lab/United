import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Sparkles, FileText, Download, Play, Image as ImageIcon, 
  Loader2, Volume2, VolumeX, Mic, Share2, MoreVertical, Search, ArrowLeft, Video, Phone 
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  generatedDocType?: "excel" | "pdf" | "word";
  generatedDocData?: string;
  imageUrl?: string;
  replyTo?: {
    role: string;
    content: string;
  };
}

export default function AgriBotPanel({ initialPrompt, onBack }: { initialPrompt?: string; onBack?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour frère agro-entrepreneur ! Je suis **Agribot IA 🧠**, votre **Consultante Agricole Titulaire** d'élite.\n\nFormée sous la direction de l'Administrateur de la plateforme AgriBot et fort du savoir-faire du Centre Songhaï de Porto-Novo, je vous apporte des solutions concrètes pour optimiser vos rendements :\n- Fiches techniques maraîchères de précision (tomate, oignon Galmi, agroécologique...),\n- Protocoles sanitaires d'élevage performant (volailles, petits ruminants, lapins...),\n- Modèles de plans d'affaires et budgets prévisionnels.\n\nPosez-moi votre question technique ou demandez-moi un budget prévisionnel !"
    }
  ]);
  const [input, setInput] = useState("");
  
  // Custom smart sociable elements
  const [personality, setPersonality] = useState<"scientific" | "village_brother" | "strategist">("scientific");
  const [isListening, setIsListening] = useState(false);
  const [shareSuccessIndex, setShareSuccessIndex] = useState<number | null>(null);

  // Edit, Delete, and Reply/Tag states
  const [editingMsgIndex, setEditingMsgIndex] = useState<number | null>(null);
  const [editingMsgText, setEditingMsgText] = useState("");
  const [botReplyTo, setBotReplyTo] = useState<{ role: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingDoc, setGeneratingDoc] = useState<"excel" | "pdf" | "word" | null>(null);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [audioLoadingIndex, setAudioLoadingIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Stop audio and request on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlaySpeech = async (text: string, index: number) => {
    // Remove markdowns and emojis for speech rendering optimization
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/##/g, "")
      .replace(/[-\*#]/g, " ")
      .replace(/`[^`]+`/g, "");

    if (playingIndex === index) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingIndex(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setAudioLoadingIndex(index);
    try {
      const res = await fetch("/api/gemini/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText })
      });

      if (!res.ok) {
        console.warn("Server speech failed, falling back to browser speech synthesis...");
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = "fr-FR";
          const voices = window.speechSynthesis.getVoices();
          const frVoice = voices.find(v => v.lang.startsWith("fr") || v.lang.startsWith("FR"));
          if (frVoice) {
            utterance.voice = frVoice;
          }
          utterance.onstart = () => {
            setPlayingIndex(index);
          };
          utterance.onend = () => {
            setPlayingIndex(null);
          };
          utterance.onerror = () => {
            setPlayingIndex(null);
          };
          window.speechSynthesis.speak(utterance);
          return;
        }
        console.warn("Failed to generate speech via backend");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.play().then(() => {
        setPlayingIndex(index);
      });

      audio.onended = () => {
        setPlayingIndex(null);
      };
    } catch (err) {
      console.warn("Audio playback error, using browser speech synthesis fallback:", err);
      if ("speechSynthesis" in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = "fr-FR";
          const voices = window.speechSynthesis.getVoices();
          const frVoice = voices.find(v => v.lang.startsWith("fr") || v.lang.startsWith("FR"));
          if (frVoice) {
            utterance.voice = frVoice;
          }
          utterance.onstart = () => {
            setPlayingIndex(index);
          };
          utterance.onend = () => {
            setPlayingIndex(null);
          };
          utterance.onerror = () => {
            setPlayingIndex(null);
          };
          window.speechSynthesis.speak(utterance);
          return;
        } catch (synthErr) {
          console.warn("Fallback synthesis failed:", synthErr);
        }
      }
    } finally {
      setAudioLoadingIndex(null);
    }
  };

  // Send input if initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    if (!textToSend) setInput("");
    
    // Add User message
    const userMsg: Message = { 
      role: "user", 
      content: promptText,
      replyTo: botReplyTo ? { role: botReplyTo.role, content: botReplyTo.content } : undefined
    };
    setBotReplyTo(null);
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const chatHistory = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
      
      let activeUser = null;
      try {
        const activeUserRaw = localStorage.getItem("agribot_active_user");
        if (activeUserRaw) activeUser = JSON.parse(activeUserRaw);
      } catch (e) {}

      const res = await fetch("/api/gemini/agribot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: promptText, 
          chatHistory,
          user: activeUser,
          personality
        }),
        signal: controller.signal
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.error || "Une erreur est survenue lors de l'appel d'Agribot IA 🧠."
        }]);
        return;
      }

      // Detect if the user explicitly requested a file/report download and Gemini proposes it
      let docType: "excel" | "pdf" | "word" | undefined;
      const responseTextLower = data.reply.toLowerCase();
      const promptTextLower = promptText.toLowerCase();
      const userRequestedFile = promptTextLower.includes("générer") || 
                                promptTextLower.includes("télécharger") || 
                                promptTextLower.includes("exporter") || 
                                promptTextLower.includes("fichier") || 
                                promptTextLower.includes("document") || 
                                promptTextLower.includes("rapport") || 
                                promptTextLower.includes("download") || 
                                promptTextLower.includes("export");
      
      if (userRequestedFile) {
        if (responseTextLower.includes("rentabilité") || responseTextLower.includes("budget") || responseTextLower.includes("tableau")) {
          docType = "excel";
        } else if (responseTextLower.includes("fiche technique") || responseTextLower.includes("diagnostic")) {
          docType = "pdf";
        } else if (responseTextLower.includes("projet") || responseTextLower.includes("canevas") || responseTextLower.includes("rapport")) {
          docType = "word";
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply,
        generatedDocType: docType,
        generatedDocData: "Contenu formaté produit en direct d'Agribot IA 🧠."
      }]);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "🛑 **Demande interrompue.** Vous pouvez taper une nouvelle question technique pour continuer."
        }]);
        return;
      }
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Erreur de connexion internet. Vérifiez votre liaison avec le serveur."
      }]);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  };

  const startVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur votre navigateur.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "fr-FR";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInput(prev => prev ? prev + " " + transcript : transcript);
      }
    };

    recognition.onerror = (err: any) => {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handlePublishToForum = async (text: string, index: number) => {
    let activeUser = null;
    try {
      const activeUserRaw = localStorage.getItem("agribot_active_user");
      if (activeUserRaw) activeUser = JSON.parse(activeUserRaw);
    } catch (e) {}

    if (!activeUser || !activeUser.id) {
      alert("Veuillez d'abord vous connecter pour partager ce conseil technique.");
      return;
    }

    try {
      const forumContent = `💡 CONSEIL PARTAGÉ DE L'IA AGRIBOT (Mode ${
        personality === "scientific" ? "Scientifique" : personality === "village_brother" ? "Frère du Village" : "Stratège d'Affaires"
      }) :\n\n${text}`;

      const payload = {
        senderId: activeUser.id,
        senderName: `@${activeUser.username || "Adhérent"}${activeUser.firstName ? " (" + activeUser.firstName + ")" : ""}`,
        content: forumContent,
        isPrivate: false
      };

      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShareSuccessIndex(index);
        setTimeout(() => setShareSuccessIndex(null), 3000);
      } else {
        alert("Une erreur est survenue lors du partage.");
      }
    } catch (err) {
      console.error("Failed to share with AgriChat:", err);
    }
  };

  const generateIllustration = async (topic: string) => {
    setGeneratingImg(true);
    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Voici l'illustration générée pour votre recherche : **"${topic}"**`,
        imageUrl: data.imageUrl
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingImg(false);
    }
  };

  const triggerDownload = (type: "excel" | "pdf" | "word", text: string) => {
    setGeneratingDoc(type);
    setTimeout(() => {
      let filename = `agriz_fiche_technique_${Date.now()}`;
      let mimeType = "text/plain";
      let contentString = "";

      const textLower = text.toLowerCase();
      const isPoultry = textLower.includes("poulet") || textLower.includes("chair") || textLower.includes("avicol") || textLower.includes("élevage") || textLower.includes("poussin") || textLower.includes("coq");

      if (type === "excel") {
        filename = `agribot_calcul_rentabilite_${Date.now()}.csv`;
        mimeType = "text/csv;charset=utf-8;";
        
        if (isPoultry) {
          contentString = "AGRIBOT MINE D'OR - BUDGET ET PREVISIONS DE RENTABILITE ELEVAGE DE POULETS DE CHAIR\n\n" +
                          "Poste de charge / Recette,Description Technique,Quantite estimee,Prix Unitaire (FCFA),Montant Global (FCFA)\n" +
                          "Achat de poussins d'un jour,Sujets vigoureux de qualite certifiee,1000 Poussins,600,600000\n" +
                          "Aliment de Demarrage complet,Sacs de 50 kg broyes,45 Sacs,19500,877500\n" +
                          "Aliment de Croissance performant,Sacs de 50 kg granules,50 Sacs,18500,925000\n" +
                          "Aliment de Finition de poids,Sacs de 100 kg granules,20 Sacs,18000,360000\n" +
                          "Suivi sanitaire et vaccins,Vaccins obligatoires (Gumboro Newcastle),Forfait global,150,150000\n" +
                          "Abreuvoirs et mangeoires,Equipement reglable de démarrage,30 Unites,4500,135000\n" +
                          "Chauffage radiant infrarouge,Gaz de chauffage et electricite,Consommation,75000,75000\n" +
                          "Copeaux de bois / Litiere seche,Isolant thermique hygiénique,Forfait hygiene,15000,15000\n" +
                          "COUT TOTAL INVESTISEMENT OPERATIONNEL,,,,3132500\n" +
                          "Ventes de poulets prets a consommer,Taux de mortalite maitrise a 5% (950 sujets vivants),950 Poulets de chair,3500,3325000\n" +
                          "CHIFFRE D'AFFAIRES PROJETE,,,,3325000\n" +
                          "BENEFICE RETRANCHE NET,,,,192500\n";
        } else if (textLower.includes("tomate") || textLower.includes("flétrissement") || textLower.includes("maraîch") || textLower.includes("culture")) {
          contentString = "AGRIBOT MINE D'OR - BUDGET ET RENTABILITE PREVISIONNELLE CULTURE DE TOMATES\n\n" +
                          "Poste de charge,Detail Technique,Quantite necessaire,Prix Unitaire (FCFA),Cout Total Projete (FCFA)\n" +
                          "Semences Tomate Amelioree,Sachets de semences F1 resistantes,10 Sachets,12000,120000\n" +
                          "Supports et plateaux alveoles,Pre-germination Songhaï en pepiniere,Forfait technique,35000,35000\n" +
                          "Engrais de fond complet (NPK),NPK de bonne marque bio,5 Sacs de 50kg,22000,110000\n" +
                          "Traitements Biologiques naturels,Preparation a base de neem / piment,Forfait phytosanitaire,40000,40000\n" +
                          "Systeme d'arrosage goutte-a-goutte,Kit complet de tuyaux et goutteurs,Equipements,175000,175000\n" +
                          "Main d'oeuvre maraîchere,Travaux de labour et recoltes,60 Hommes-jours,2500,150000\n" +
                          "Transport vers grossistes,Livraison par camionnette locale,Forfait,50000,50000\n" +
                          "COUT GENERAL DE PRODUCTION,,,,630000\n" +
                          "Vente estimative de tomates,Taux de rendement (perte de 5%),400 Caisses,4000,1600000\n" +
                          "REVENUE NET PROJETE (BENEFICE),,,,970000\n";
        } else {
          const rows: string[] = ["AGRIBOT MINE D'OR - RAPPORT SPECIAL DE PREVISIONS COMPTABLES\n"];
          const lines = text.split("\n");
          lines.forEach(l => {
            if (l.includes("|")) {
              const cells = l.split("|").map(c => c.trim()).filter(c => c !== "");
              if (cells.length > 0 && !cells[0].startsWith("-") && !cells[0].includes("===")) {
                rows.push(cells.join(","));
              }
            }
          });
          if (rows.length > 2) {
            contentString = rows.join("\n");
          } else {
            contentString = "Rubrique/Poste,Designation Generale,Valeurs Estimatives (FCFA)\n" +
                            `Analyse Contextuelle,${text.substring(0, 80).replace(/,/g, " ")},350000\n` +
                            "Charges operationnelles courantes,Fourre-tout de production,80000\n" +
                            "Prevision de gain estimatf,Resultat calculé d'un cycle,270000\n";
          }
        }
      } else if (type === "pdf") {
        filename = `agribot_fiche_diagnostic_${Date.now()}.pdf`;
        mimeType = "application/pdf";
        contentString = `%PDF-1.4\n% Agribot Mine d'Or Fiche Technique\n` +
                        `====================================================================================\n` +
                        `                 FICHE TECHNIQUE ET DIAGNOSTIC AGRIBOT IA                          \n` +
                        `====================================================================================\n` +
                        `Sujet : ${isPoultry ? "Elevage avicole (Poulets de chair)" : "Itineraire de Production Maraîchere & Vegetale"}\n` +
                        `Auteur : Administrateur de la plateforme AgriBot, Agro socio vulgarisateur\n` +
                        `Formation d'origine : Centre Songhaï\n` +
                        `Date d'edition : ${new Date().toLocaleDateString("fr-FR")}\n` +
                        `------------------------------------------------------------------------------------\n\n` +
                        `CONTENU SCIENTIFIQUE DE LA FICHE : \n\n${text}\n\n` +
                        `------------------------------------------------------------------------------------\n` +
                        `Securite & Protection de l'Information de Diagnostic\n` +
                        `Document proteges par copyright. Source: administrateur@agribot-africa.com\n` +
                        `====================================================================================\n`;
      } else {
        filename = `agribot_canevas_projet_${Date.now()}.doc`;
        mimeType = "application/msword";
        contentString = `====================================================================================\n` +
                        `                   CANEVAS DE PROJET D'ENTREPRISE AGRIBOT IA                       \n` +
                        `====================================================================================\n` +
                        `Objet : Plan d'exploitation formule par l'IA Agribot IA\n` +
                        `Responsable de redaction : Administrateur de la plateforme AgriBot (Agro socio vulgarisateur)\n` +
                        `Source des connaissances : Formé au Centre Songhaï\n` +
                        `Chantier : ${isPoultry ? "Aviculture de gros - Production de Poulets de chair" : "Exploitation agricole Maraîchere"}\n` +
                        `Date de compilation : ${new Date().toLocaleDateString("fr-FR")}\n` +
                        `------------------------------------------------------------------------------------\n\n` +
                        `DESCRIPTIF ET CRITERIALS OPERATIONNELS DU PROJET :\n\n${text}\n\n` +
                        `------------------------------------------------------------------------------------\n` +
                        `Note de confidentialite : Toutes les donnees techniques d'itineraire ci-dessus\n` +
                        `sont tirees des competences de vulgarisation agroecologique Songhaï.\n` +
                        `====================================================================================\n`;
      }

      const blob = new Blob([contentString], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setGeneratingDoc(null);
    }, 1200);
  };

  const renderCleanMessageContent = (m: Message) => {
    if (m.role === "user") {
      return <div className="whitespace-pre-wrap select-text">{m.content}</div>;
    }

    const lines = m.content.split("\n");
    const processedElements: React.ReactNode[] = [];
    
    let currentTableRows: string[][] = [];
    let isInsideTable = false;

    const flushTable = (key: number) => {
      if (currentTableRows.length === 0) return null;
      
      let headers: string[] = [];
      let rows: string[][] = [];
      
      const parsedRows = currentTableRows.map(row => 
         row.map(cell => cell.trim())
      ).filter(cells => 
         cells.length > 0 && !cells.every(c => c.startsWith("-") || !c)
      );

      if (parsedRows.length > 0) {
        if (currentTableRows[0].every(c => c.trim().startsWith("-") || !c.trim())) {
          rows = parsedRows;
        } else {
          headers = parsedRows[0];
          rows = parsedRows.slice(1);
        }
      }

      currentTableRows = [];
      isInsideTable = false;

      return (
        <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-xl border border-emerald-950/20 shadow-lg bg-[#141f16] -mx-1 px-2.5">
          <table className="w-full text-left border-collapse text-[11.5px] md:text-sm">
            {headers.length > 0 && (
              <thead>
                <tr className="border-b border-emerald-900/40 text-[#2ecc71] font-bold">
                  {headers.map((h, i) => (
                    <th key={i} className="px-2 py-1.5 font-sora font-semibold text-[#2ecc71] whitespace-nowrap">{h || "-"}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-emerald-950/20 last:border-b-0 hover:bg-[#1e2d18]/40 transition duration-100">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-2 py-1.5 text-[#e8f5ec] select-text font-semibold whitespace-nowrap">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const parseInlineMarkdown = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-[#2ecc71] font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|") && (trimmedLine.match(/\|/g) || []).length > 2) {
        isInsideTable = true;
        const cells = trimmedLine.split("|").slice(1, -1);
        currentTableRows.push(cells);
      } else {
        if (isInsideTable) {
          const tableNode = flushTable(idx);
          if (tableNode) processedElements.push(tableNode);
        }

        if (trimmedLine.startsWith("###") || trimmedLine.startsWith("##") || trimmedLine.startsWith("#")) {
          const titleText = trimmedLine.replace(/^#+\s*/, "");
          processedElements.push(
            <div key={idx} className="font-sora font-bold text-[12px] uppercase text-[#2ecc71] tracking-wider mt-4 mb-2 flex items-center gap-2 border-b border-emerald-950/15 pb-1">
              <span>◆</span>
              <span>{titleText}</span>
            </div>
          );
        }
        else if (trimmedLine.endsWith(":") && trimmedLine.length < 50 && !trimmedLine.startsWith("-") && !trimmedLine.startsWith("*")) {
          processedElements.push(
            <div key={idx} className="text-[12px] font-bold text-[#2ecc71] uppercase tracking-wide mt-2.5 mb-1.5 border-l-2 border-[#1a8c4e] pl-2">
              {trimmedLine}
            </div>
          );
        }
        else if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
          const itemText = trimmedLine.replace(/^[-*]\s*/, "");
          processedElements.push(
            <div key={idx} className="flex items-start gap-2 pl-1 my-1.5 text-[#c8e6cc]">
              <span className="text-[#2ecc71] text-xs mt-0.5 shrink-0">✔</span>
              <span className="flex-1 select-text font-semibold leading-relaxed">{parseInlineMarkdown(itemText)}</span>
            </div>
          );
        }
        else {
          if (trimmedLine !== "") {
            processedElements.push(
              <p key={idx} className="my-2 text-[#e8f5ec] select-text leading-relaxed font-semibold">
                {parseInlineMarkdown(line)}
              </p>
            );
          } else {
            processedElements.push(<div key={idx} className="h-1.5" />);
          }
        }
      }
    }

    if (isInsideTable) {
      const tableNode = flushTable(lines.length);
      if (tableNode) processedElements.push(tableNode);
    }

    return (
      <div className="space-y-0.5">
        {processedElements}
      </div>
    );
  };

  return (
    <div 
      className="flex flex-col rounded-none sm:rounded-3xl overflow-hidden border-t border-b sm:border border-x-0 sm:border-x font-sans relative h-[calc(100vh-104px)] h-[calc(100dvh-104px)] sm:h-[650px] min-h-[420px]"
      style={{
        backgroundColor: "#0a0f0d",
        borderColor: "rgba(39, 174, 96, 0.15)"
      }}
    >
      {/* ── HEADER AGRI-Z ── */}
      <div 
        className="flex items-center justify-between p-3 flex-shrink-0 text-left"
        style={{
          backgroundColor: "#111a14",
          borderBottom: "1px solid rgba(39, 174, 96, 0.15)"
        }}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition hover:bg-[#1e2d18]"
              style={{ backgroundColor: "#172110", border: "1px solid rgba(39, 174, 96, 0.15)", color: "#e8f5ec" }}
              title="Retour à l'accueil"
            >
              <ArrowLeft className="w-4 h-4 text-[#2ece76]" />
            </button>
          )}
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md relative shrink-0"
            style={{
              background: "linear-gradient(135deg, #0a3d20, #1a8c4e)",
              border: "2px solid #27ae60"
            }}
          >
            🧠
          </div>
          <div>
            <div className="font-sora font-extrabold text-[15px]" style={{ color: "#e8f5ec" }}>AGRIBOT AI</div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#2ecc71", animation: "pulse 2s ease infinite" }}
              />
              <span className="font-semibold text-[#2ecc71]">En ligne · Consultante agricole</span>
            </div>
          </div>
        </div>
      </div>
      {/* ── DIALOG MESSAGES ZONE ── */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-none bg-[#0a0f0d]">
        <div className="date-sep flex items-center gap-2.5 justify-center mb-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: "#4a7057" }}>
            Aujourd'hui · 10h48
          </span>
        </div>

        {messages.map((m, index) => (
          <div key={index} className="space-y-1 group relative">
            {m.role === "assistant" && (
              <div className="flex items-center gap-2 pl-0.5">
                <div 
                  className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-[12px] bg-gradient-to-tr from-[#0a3d20] to-[#1a8c4e] text-white"
                  style={{ width: "22px", height: "22px" }}
                >
                  🧠
                </div>
                <span className="font-extrabold text-[11px] tracking-wider text-[#2ecc71]">
                  AGRIBOT AI
                </span>
                <span className="text-[10px]" style={{ color: "#4a7057" }}>
                  À l'instant
                </span>
              </div>
            )}

            <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div 
                className="p-3.5 text-left text-[13.5px] leading-relaxed shadow-md w-full relative"
                style={{
                  maxWidth: m.role === "user" ? "78%" : "92%",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: m.role === "user" ? "linear-gradient(135deg, #1a5c35, #1e6e3e)" : "#131d14",
                  border: m.role === "user" ? "1px solid rgba(46,204,113,0.25)" : "1px solid rgba(39,174,96,0.15)",
                  color: "#e8f5ec"
                }}
              >
                {/* Replied block if tagged */}
                {m.replyTo && (
                  <div className="p-2 mb-2 rounded border-l-3 text-[11px]" style={{ backgroundColor: "rgba(0, 0, 0, 0.25)", borderLeftColor: "#2ecc71" }}>
                    <div className="font-extrabold" style={{ color: "#2ecc71" }}>En réponse à {m.replyTo.role === "assistant" ? "AgriBot IA 🤖" : "l'agriculteur"} :</div>
                    <div className="text-zinc-400 italic truncate text-[11.5px]">{m.replyTo.content}</div>
                  </div>
                )}

                {/* Clean inline and complex tables parsing */}
                <div className="whitespace-pre-wrap break-words">
                  {editingMsgIndex === index ? (
                    <div className="flex flex-col gap-1.5 w-full mt-1">
                      <textarea 
                        value={editingMsgText}
                        onChange={(e) => setEditingMsgText(e.target.value)}
                        className="bg-[#121c15] text-[#e8f5ec] text-xs p-2 rounded border border-emerald-500/30 outline-none resize-none w-full font-sans"
                        rows={3}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => setEditingMsgIndex(null)}
                          className="text-[10px] bg-zinc-805 text-zinc-350 px-2 py-1 rounded font-bold cursor-pointer transition"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={() => {
                            if (editingMsgText.trim()) {
                              setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, content: editingMsgText } : msg));
                              setEditingMsgIndex(null);
                            }
                          }}
                          className="text-[10px] bg-[#27ae60] text-white px-2 py-1 rounded font-bold hover:bg-[#2ecc71] cursor-pointer transition"
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  ) : (
                    renderCleanMessageContent(m)
                  )}
                </div>

                {/* VOIX ET PARTAGE AGRIBOT AI ACTION BAR */}
                {m.role === "assistant" && !editingMsgIndex && (
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePlaySpeech(m.content, index)}
                      disabled={audioLoadingIndex !== null && audioLoadingIndex !== index}
                      className="voice-btn flex items-center gap-1.5 rounded-full py-1.5 px-3.5 text-[12px] font-semibold cursor-pointer border hover:opacity-90 transition"
                      style={{
                        background: "rgba(46, 204, 113, 0.08)",
                        borderColor: "rgba(46, 204, 113, 0.2)",
                        color: "#2ecc71"
                      }}
                    >
                      {audioLoadingIndex === index ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Synthèse vocale...</span>
                        </>
                      ) : playingIndex === index ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5 animate-pulse text-rose-500" />
                          <span className="text-rose-500">Arrêter l'audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>🔊 Écouter (Gemini TTS Puck)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handlePublishToForum(m.content, index)}
                      disabled={shareSuccessIndex === index}
                      className="share-btn flex items-center gap-1.5 rounded-full py-1.5 px-3.5 text-[12px] font-semibold cursor-pointer border hover:opacity-90 transition"
                      style={{
                        background: shareSuccessIndex === index ? "rgba(46, 204, 113, 0.2)" : "rgba(39, 174, 96, 0.08)",
                        borderColor: shareSuccessIndex === index ? "rgba(46, 204, 113, 0.6)" : "rgba(39, 174, 96, 0.2)",
                        color: "#e8f5ec"
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5 text-[#2ecc71]" />
                      <span>{shareSuccessIndex === index ? "✅ Partagé sur le Forum !" : "📢 Publier sur AgriChat"}</span>
                    </button>
                  </div>
                )}

                {/* Additional controls underneath message bubble */}
                <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-[#27ae60]/10 text-[10px] text-[#4a7057] select-none">
                  {/* Tag / reply button on any message */}
                  <button
                    onClick={() => {
                      setBotReplyTo({ role: m.role, content: m.content });
                    }}
                    className="hover:text-[#2ecc71] cursor-pointer transition flex items-center gap-0.5 font-bold"
                    title="Répondre / Taguer ce message"
                  >
                    ↩️ Taguer
                  </button>

                  {/* Edit/delete for user messages */}
                  {m.role === "user" && (
                    <>
                      <button
                        onClick={() => {
                          setEditingMsgIndex(index);
                          setEditingMsgText(m.content);
                        }}
                        className="hover:text-amber-400 cursor-pointer transition ml-1 py-0.5 px-1 bg-zinc-950/20 rounded"
                        title="Modifier mon message"
                      >
                        ✍️ Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Supprimer ce message de la discussion ?")) {
                            setMessages(prev => prev.filter((_, idx) => idx !== index));
                          }
                        }}
                        className="hover:text-rose-400 cursor-pointer transition ml-1 font-bold py-0.5 px-1 bg-zinc-950/20 rounded"
                        title="Supprimer mon message"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>

                {/* Image Generated or Attached */}
                {m.imageUrl && (
                  <div className="mt-3.5 rounded-lg overflow-hidden border" style={{ borderColor: "rgba(39, 174, 96, 0.15)" }}>
                    <img src={m.imageUrl} alt="AI output preview" className="w-full h-auto object-cover max-h-72" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div 
              className="p-3 rounded-xl flex items-center gap-3 border shadow-md animate-pulse"
              style={{
                borderColor: "rgba(39,174,96,0.15)",
                backgroundColor: "#131d14"
              }}
            >
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-[#2ecc71] animate-spin" />
                <span className="text-xs text-zinc-300">En attente de réponse...</span>
              </div>
              <button
                onClick={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                  }
                  setLoading(false);
                }}
                className="px-2 py-1 bg-red-650 hover:bg-red-500 text-white font-bold text-[10px] rounded border border-red-500/30 cursor-pointer transition select-none flex items-center gap-0.5 uppercase tracking-wider shrink-0"
              >
                <span>Interrompre 🛑</span>
              </button>
            </div>
          </div>
        )}

        {generatingImg && (
          <div className="flex justify-start">
            <div 
              className="p-3 rounded-xl flex items-center gap-2 border shadow-md"
              style={{
                borderColor: "rgba(39,174,96,0.15)",
                backgroundColor: "#131d14"
              }}
            >
              <Sparkles className="h-4 w-4 text-[#2ecc71] animate-pulse" />
              <span className="text-xs text-zinc-300">AgriBot IA illustre avec précision votre champ durable...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* FOOTER INPUT BAR */}
      <div 
        className="p-2.5 shrink-0 text-left"
        style={{
          backgroundColor: "#111a14",
          borderTop: "1px solid rgba(39, 174, 96, 0.15)"
        }}
      >
        {/* Reply Tag Preview to notify the user they are replying */}
        {botReplyTo && (
          <div className="flex items-center justify-between p-2 mb-2 bg-[#172110] rounded border-l-2 border-[#2ecc71] text-xs animate-fade-in">
            <div className="truncate pr-4 text-[#e8f5ec]">
              <span className="font-bold text-[#2ecc71]">Tag : </span>
              {botReplyTo.role === "assistant" ? "AgriBot IA 🤖" : "Agriculteur"} - <span className="italic">{botReplyTo.content}</span>
            </div>
            <button
              onClick={() => setBotReplyTo(null)}
              className="text-zinc-400 hover:text-white font-bold cursor-pointer transition text-xs shrink-0 px-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Dictée Vocale Mic Button Pin */}
          <button
            onClick={startVoiceDictation}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border shrink-0 ${
              isListening 
                ? "bg-rose-600 border-rose-500 text-white animate-pulse" 
                : "bg-[#172110] border-emerald-500/20 hover:border-emerald-500 text-emerald-450"
            }`}
            title={isListening ? "Écoute active en cours... Parlez !" : "Saisie vocale / Dictée"}
          >
            <Mic className={`h-4.5 w-4.5 ${isListening ? "animate-bounce" : ""}`} />
          </button>

          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Écoute en cours... Parlez maintenant !" : "Posez votre question agricole…"}
            className="flex-1 rounded-xl p-2.5 outline-none font-semibold text-xs xs:text-sm border transition"
            style={{
              backgroundColor: "#172110",
              borderColor: "rgba(39, 174, 96, 0.15)",
              color: "#e8f5ec"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          {loading ? (
            <button 
              onClick={() => {
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                }
                setLoading(false);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-red-650 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
              title="Interrompre AgriBot IA"
            >
              🛑
            </button>
          ) : (
            <button 
              onClick={() => handleSend()}
              className="send-btn w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none"
              style={{
                background: "linear-gradient(135deg, #1a8c4e, #27ae60)",
                boxShadow: "0 4px 14px rgba(46,204,113,0.3)"
              }}
            >
              ➤
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
