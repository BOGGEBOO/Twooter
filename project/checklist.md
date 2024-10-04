## checklista över projektet
- [ ] Användare ska kunna registrera sig med användarnamn och lösenord.
- [ ] Användare ska kunna logga in och logga ut.
- [ ] Lösenord ska inte skickas eller sparas som läsbar text.

---

- [ ] Endast ny informationen ska uppdateras på hemsidan, dvs. hela webbplatsen ska endast laddas om i undantagsfall.
- [ ] Det ska finnas en sökfunktion för att hitta andra användare. Man ska kunna söka efter användare även om man bara vet en del av namnet.

---

- [ ] Användare ska kunna lägga skicka vänförfrågningar till andra användare.
- [ ] Vänförfrågningar måste accepteras innan man blir vänner.
- [ ] Vänförfrågningar ska inte kunna skickas till användare man redan är vän med.
- [ ] Användare ska kunna se en lista över sina vänner.
- [ ] Användare ska ha en personlig sida.
- [ ] Användare ska kunna se sina vänners sidor.
- [ ] Användare ska endast kunna posta meddelanden på sin egen och sina vänners sidor.
- [ ] Användare ska inte kunna agera som någon annan, dvs. konton är personliga.

---

- [ ] Nya meddelanden ska valideras på klientsidan. Meddelanden får inte vara tomma eller innehålla fler än 140 tecken.
- [ ] Nya meddelanden ska valideras på serversidan enligt samma regler som ovan.
- [ ] Inledande och efterföljande whitespace-tecken ska trimmas bort från meddelanden innan validering.

---

- [ ] Data ska sparas i en MongoDB-databas.
- [ ] Serversidan ska vara skyddad mot MongoDB-injections.
- [ ] Testning/kodtäckning av backend ska göras med Mocha/Istanbul.
- [ ] Alla element ska placeras på lämpligt sätt i förhållande till varande med lämplig justering av komponenter i höjd- och breddled samt väl valda avstånd mellan komponenter.

## Olika sidor
- login-sida (index.html)
- profil-sida
- lista över vänner
- meddelanden

## funktionalitet
- söka efter användare
- logga in
- posta meddelanden
- skicka vänförfrågan
- acceptera vänförfrågan
- visa vänner
- visa meddelanden