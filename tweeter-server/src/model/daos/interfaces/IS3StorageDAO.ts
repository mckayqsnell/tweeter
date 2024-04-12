export interface IS3StorageDAO {
    putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}