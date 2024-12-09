import { sendEmail } from "./email";

(async () => {
  try {
    await sendEmail("mohihtpranav9@example.com", "Test Check", "Test Success");
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
})();
