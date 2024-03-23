#include <iostream>
#include <fstream>
#include <direct.h>
#include <string>
#include <cstdlib>
#include <filesystem>

void logError(const std::string& message) {
    std::ofstream logFile("texCompileLog.txt", std::ios_base::app);
    logFile << "[ERROR] " << message << std::endl;
    logFile.close();
}

void logInfo(const std::string& message) {
    std::ofstream logFile("texCompileLog.txt", std::ios_base::app);
    logFile << "[INFO] " << message << std::endl;
    logFile.close();
}

int main(int argc, char* argv[]) {
    logInfo("texCompileHelp is being executed.");

    if (argc < 2) {
        logError("Usage: texCompileHelp.exe <path_to_tex_file> [crop]");
        return 1;
    }

    std::string texPathStr = argv[1];
    logInfo("Path received: " + texPathStr);

    std::filesystem::path texPath = texPathStr;
    std::string pdfPath = texPathStr.substr(0, texPathStr.rfind('.')) + ".pdf";

    std::string texDir = texPathStr.substr(0, texPathStr.find_last_of("\\/"));
    _chdir(texDir.c_str());

    char cwd[1024];
    if (getcwd(cwd, sizeof(cwd)) != NULL) {
        logInfo("Current working directory: " + std::string(cwd));
    } else {
        logError("Error getting current directory.");
    }

    // Compile LaTeX to PDF using pdflatex
    // std::string compileCmd = "pdflatex -interaction=nonstopmode " + texPathStr;
    // logInfo("About to execute: " + compileCmd);

    // Compile LaTeX to PDF using XeLaTeX
    std::string compileCmd = "xelatex -interaction=nonstopmode " + texPathStr;
    logInfo("About to execute: " + compileCmd);
    
    int result = system(compileCmd.c_str());

    if (result != 0) {
        logError("Error during LaTeX compilation.");
        return result;
    }

    if (std::filesystem::exists(pdfPath)) {
        logInfo("PDF file generated at: " + pdfPath);
    } else {
        logError("PDF not found at: " + pdfPath);
    }

    // If "crop" argument is provided, crop the PDF using pdfcrop
    if (argc > 2 && std::string(argv[2]) == "crop") {
        std::filesystem::path tempDir = texPath.parent_path() / "tempDir";
        std::filesystem::create_directory(tempDir);

        std::filesystem::path tempPdfPath = tempDir / texPath.filename();
        std::filesystem::rename(pdfPath, tempPdfPath);

        std::string cropCmd = "pdfcrop " + tempPdfPath.string() + " " + tempPdfPath.string();
        logInfo("Executing crop command: " + cropCmd);

        result = system(cropCmd.c_str());

        if (result != 0) {
            logError("Error during PDF cropping.");
            return result;
        }

        std::filesystem::rename(tempPdfPath, pdfPath);
        std::filesystem::remove_all(tempDir);
    }

    logInfo("texCompileHelp finished successfully.");
    return 0;
}
