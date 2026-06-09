declare module 'validate-npm-package-name' {
  type Result = {
    validForNewPackages: boolean;
    validForOldPackages: boolean;
    errors?: string[];
    warnings?: string[];
  };
  export default function validate(name: string): Result;
}
