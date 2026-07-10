declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      ANTHROPIC_API_KEY: string;
      DATABASE_URL: string;
    }
  }
}

// If this file has no imports/exports, turn it into a module
export {};
