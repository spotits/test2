

<%@ include file="testa.jsp" %>
<h1>inserire nova azienda</h1>
<form name="input" action="SelezionaAzienda" method="post">
Nome: <input type="text" name="nome">
<input type="submit" value="Crea">
</form> 
<a href="CaricaAzienda">Carica Azienda gia inserita</a>
<%@ include file="coda.jsp" %>