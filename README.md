# Alarme de Inclinação e Queda

Este projeto é uma aplicação desenvolvida com Ionic que utiliza o acelerômetro para monitorar a inclinação e quedas de dispositivos móveis. A aplicação possui um painel de controle para configurar sensibilidades do alarme e visualizar logs de alertas.

## Estrutura do Projeto

```
alarme-inclinacao-queda
├── src
│   ├── app
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── pages
│   │   ├── home
│   │   │   ├── home.page.ts
│   │   │   ├── home.page.html
│   │   │   └── home.page.scss
│   │   ├── painel
│   │   │   ├── painel.page.ts
│   │   │   ├── painel.page.html
│   │   │   └── painel.page.scss
│   │   └── logs
│   │       ├── logs.page.ts
│   │       ├── logs.page.html
│   │       └── logs.page.scss
│   ├── services
│   │   ├── acelerometro.service.ts
│   │   ├── alarme.service.ts
│   │   └── logs.service.ts
│   └── types
│       └── index.ts
├── ionic.config.json
├── package.json
├── tsconfig.json
└── README.md
```

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   ```
2. Navegue até o diretório do projeto:
   ```
   cd alarme-inclinacao-queda
   ```
3. Instale as dependências:
   ```
   npm install
   ```

## Uso

Para iniciar a aplicação, execute o seguinte comando:
```
ionic serve
```

A aplicação será aberta em seu navegador padrão. Você poderá acessar as diferentes páginas para monitorar a inclinação, configurar o alarme e visualizar os logs de alertas.

## Contribuição

Sinta-se à vontade para contribuir com melhorias e correções. Para isso, faça um fork do repositório e envie um pull request com suas alterações.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.