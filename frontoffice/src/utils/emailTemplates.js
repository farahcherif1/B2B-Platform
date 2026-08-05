
export const emailTemplates = {
    "Template Basique": `<p>Hello World!</p>
      <p>This is an simple editable area.</p>
      <p>• Select a text to reveal the toolbar.</p>
      <p>• Edit rich document on-the-fly, so elastic!</p>
      <p>End of simple area</p>`,
  
    "Template Professionnel": `<p>Dear [Recipient],</p>
      <p>I hope this message finds you well.</p>
      <p>I'm writing to inform you about [subject matter]. As discussed previously, [additional context or details].</p>
      <p>Please find the following key points:</p>
      <ul>
        <li>Important point 1</li>
        <li>Important point 2</li>
        <li>Important point 3</li>
      </ul>
      <p>If you have any questions or require further information, please don't hesitate to contact me.</p>
      <p>Best regards,</p>
      <p>[Your Name]<br>[Your Position]<br>[Your Contact Information]</p>`,
  
    "Template Marketing": `<h2 style="color: #0AB39C; text-align: center;">Discover Our Latest Offerings!</h2>
      <p>Hello [Recipient Name],</p>
      <p>We're excited to share our latest [products/services/updates] with you!</p>
      <p><strong>🌟 SPECIAL OFFER:</strong> [Describe special offer or promotion]</p>
      <p>Here's what makes this opportunity special:</p>
      <ul>
        <li><strong>Benefit 1:</strong> Description of first benefit</li>
        <li><strong>Benefit 2:</strong> Description of second benefit</li>
        <li><strong>Benefit 3:</strong> Description of third benefit</li>
      </ul>
      <p style="text-align: center;"><strong>Limited Time Offer - Act Now!</strong></p>
      <p>Don't miss out on this amazing opportunity. Contact us today or visit our website for more information.</p>
      <p>Best regards,<br>The [Company Name] Team</p>`,
  
    "Template Invitation": `<h2 style="color: #4A6BD6; text-align: center;">You're Invited!</h2>
      <p style="text-align: center;">Please join us for</p>
      <h3 style="text-align: center;">[Event Name]</h3>
      <p style="text-align: center;"><strong>Date:</strong> [Event Date]<br>
      <strong>Time:</strong> [Event Time]<br>
      <strong>Location:</strong> [Event Location]</p>
      <p style="text-align: center;">We would be delighted to have you join us for [brief description of event].</p>
      <p style="text-align: center;"><strong>RSVP by [date]</strong></p>
      <p style="text-align: center;">We look forward to seeing you there!</p>`,
  
    "Template Confirmation": `<h3>Confirmation: [Event/Order/Registration]</h3>
      <p>Dear [Recipient Name],</p>
      <p>Thank you for your [order/registration/submission]. This email confirms that we have received your [details].</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><strong>Reference Number:</strong> [Reference Number]</li>
        <li><strong>Date:</strong> [Date]</li>
        <li><strong>Status:</strong> Confirmed</li>
      </ul>
      <p>What happens next:</p>
      <ol>
        <li>[First step]</li>
        <li>[Second step]</li>
        <li>[Third step]</li>
      </ol>
      <p>If you have any questions, please contact us at [contact email/phone].</p>
      <p>Thank you,<br>[Organization Name]</p>`,
  
    "Template Newsletter": `<div style="text-align: center;">
      <h2 style="color: #333;">[Newsletter Name] - [Month/Date]</h2>
      <p style="font-style: italic;">Your monthly update on [topic/organization]</p>
      </div>
      <hr>
      <h3>📰 Latest News</h3>
      <p><strong>[News Headline 1]</strong></p>
      <p>[Brief description of news item 1]</p>
      <p><strong>[News Headline 2]</strong></p>
      <p>[Brief description of news item 2]</p>
      <hr>
      <h3>📆 Upcoming Events</h3>
      <p><strong>[Event 1]</strong> - [Date, Time, Location]</p>
      <p><strong>[Event 2]</strong> - [Date, Time, Location]</p>
      <hr>
      <h3>💡 Did You Know?</h3>
      <p>[Interesting fact or tip relevant to your audience]</p>
      <hr>
      <p style="text-align: center;">Follow us on social media: [Social Media Links]</p>
      <p style="text-align: center;">To unsubscribe, click <a href="#">here</a></p>`,
  
    "Template Bienvenue": `<h2 style="color: #0AB39C; text-align: center;">Bienvenue !</h2>
      <p>Cher/Chère [Nom du destinataire],</p>
      <p>Nous sommes ravis de vous accueillir chez [Nom de l'entreprise/organisation]. Nous sommes heureux que vous ayez choisi de rejoindre notre communauté.</p>
      <p>Voici quelques informations pour vous aider à démarrer :</p>
      <ul>
        <li><strong>Votre compte :</strong> Votre inscription est maintenant confirmée</li>
        <li><strong>Ressources utiles :</strong> Consultez notre [guide/FAQ/tutoriel]</li>
        <li><strong>Prochaines étapes :</strong> [Instructions sur ce qu'il faut faire ensuite]</li>
      </ul>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter à [adresse e-mail/téléphone].</p>
      <p>Cordialement,<br>L'équipe [Nom de l'entreprise]</p>`,
  
    "Template Rappel": `<h3 style="color: #E67E22;">Rappel Important</h3>
      <p>Bonjour [Nom du destinataire],</p>
      <p>Ceci est un rappel amical concernant [sujet du rappel] prévu le [date/heure].</p>
      <p><strong>Détails importants :</strong></p>
      <ul>
        <li>[Détail 1]</li>
        <li>[Détail 2]</li>
        <li>[Détail 3]</li>
      </ul>
      <p>Veuillez noter que [information supplémentaire importante].</p>
      <p>Si vous avez besoin de plus d'informations ou si vous souhaitez apporter des modifications, veuillez nous contacter dès que possible.</p>
      <p>Merci,<br>[Votre nom/Organisation]</p>`
  };
  
  export const getTemplateNames = () => {
    return Object.keys(emailTemplates);
  };
  
  export const getTemplateContent = (templateName) => {
    return emailTemplates[templateName] || '';
  };