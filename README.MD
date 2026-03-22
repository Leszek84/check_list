# check_list - Check lista do wózków widłowych by Leszek Kłapkowski
 
Projekt natywnej aplikacji chmurowej realizowany w architekturze 3-warstwowej.
 
## Deklaracja Architektury (Mapowanie Azure)
Ten projekt został zaplanowany z myślą o usługach PaaS (Platform as a Service) w chmurze Azure.
 
| Warstwa | Komponent Lokalny | Usługa Azure |
| :--- | :--- | :--- |
| **Presentation** | React 19 (Vite) | Azure Static Web Apps |
| **Application** | API (.NET 9 / Node 24) | Azure App Service |
| **Data** | SQL Server (Dev) | Azure SQL Database (Serverless) |
 
## 🏗 Status Projektu i Dokumentacja
* [x] **Artefakt 1:** Zaplanowano strukturę folderów i diagram C4 (dostępny w `/docs`).
* [X] **Artefakt 2:** Konfiguracja środowiska Docker (w trakcie...).
 
> **Informacja:** Ten plik będzie ewoluował. W kolejnych etapach dodamy tutaj sekcje 'Quick Start', opis zmiennych środowiskowych oraz instrukcję wdrożenia (CI/CD).- [x] **Artefakt 3**: Zadanie 03 - Dzia�aj�ca warstwa prezentacji 
- [x] **Artefakt 3**: Zadanie 03 - Dzialajaca warstwa prezentacji 
- [x] **Artefakt 4**: Zadanie 04 - Dzialajaca warstwa logiki backendu 
