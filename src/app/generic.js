// CORRECTION

// --------------- FICHIER DE REGROUPANT LES FONCTIONS OU VARIABLES UTILISEES DANS PLUSIEURS ENDROITS ---------------

/** **************************** FONCTIONS **************************************** */
/** ******************************************************************** */

/* Ordonne une liste de données 
    Paramètres :
        - Une liste de données
        - un booléan indiquant si le tri doit être croissant ou
    Renvoie :
        - Une liste de tags
*/
const orderData = ({ data, ascending=true}) => {

    const data_dates_converted = data.map(item => {
        return {...item, date_format: new Date(item.date)}
    })
    
    const ascendingValue = ascending ? 1 : -1
    const antiChrono = (a, b) => ( ascendingValue * ((a.date_format < b.date_format) ? 1 : -1) )
    
    let dataOrdered = [...data_dates_converted].sort(antiChrono)
    dataOrdered = dataOrdered.map(item => {
        delete item.date_format
        return item
    })
    
    return dataOrdered
}

export {  orderData }