import sqlite3


@page.routes('/',method = ['GET'])
def table():
    
    try:
        
        connect = sqlite3.connect('')
        cursor  = connect.cursor()
        
        cursor.execute('Select * from ')
    
        
    
    except:
        
