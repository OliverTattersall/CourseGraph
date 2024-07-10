

export const delay = async (t:number): Promise<any> => {
    
    return new Promise(resolve => setTimeout(resolve, t));
}