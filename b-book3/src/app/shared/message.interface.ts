export interface Message {
    createdAt: firebase.default.firestore.FieldValue;
    id: string;
    from: string;
    to: string;
    msg: string;
    fromName: string;
    myMsg: boolean;
}