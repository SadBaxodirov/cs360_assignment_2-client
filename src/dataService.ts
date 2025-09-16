import * as remoteService from "./remoteService"

//get list of all transcripts
export async function getTranscripts() {
    const result = await remoteService.remoteGet('transcripts/')
    return result;
}
//create an empty transcript using student name as parameter, data is json object
export async function addTranscript(data:{studentName:string}) {
    const postResponse = await remoteService.remotePost('transcripts/', data);
    return postResponse;
}
//get specific transcript using student id
export async function getTranscript(studentID:number) {
    let exactUrl = 'transcripts/' + studentID;
    const result = await remoteService.remoteGet(exactUrl);
    return result;
}
// get list of student ids using name parameter
export async function getStudentIds(studentName:string) {
    let exactUrl = 'transcripts?name=' + studentName;
    const result = await remoteService.remoteGet(exactUrl);
    return result;
}
//delete a transcript using student id
export async function deleteTranscript(studentID:number) {
    let exactUrl = 'transcripts/' + studentID;
    const result = await remoteService.remoteDelete(exactUrl);
    return result;
}