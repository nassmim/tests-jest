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

    const ascendingValue = ascending ? 1 : -1
    const antiChrono = (a, b) => ( ascendingValue * ((a.date < b.date) ? 1 : -1) )
    
    const dataOrdered = [...data].sort(antiChrono)
    return dataOrdered
}

export {  orderData }