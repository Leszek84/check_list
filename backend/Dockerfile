# Etap budowania
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CloudBackend.csproj", "./"]
RUN dotnet restore "./CloudBackend.csproj"
COPY . .
RUN dotnet publish "CloudBackend.csproj" -c Release -o /app/publish

# Etap końcowy (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CloudBackend.dll"]