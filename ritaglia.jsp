<%@page contentType="text/html" pageEncoding="UTF-8"%>
<% String tmp = "images/"+request.getSession().getAttribute("idAzienda").toString()+"/"+request.getParameter("image"); %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Crop&amp;Resize</title>
        <link rel="stylesheet" href="cropresize.css" />
        <script type="text/javascript" src="cropresize.js"></script>
        <script language="javascript" type="text/javascript">
            addEvent(window, 'load', initCrop);
            addEvent(document, 'mousemove', mouseMove);
            addEvent(document, 'mouseup', cancelDrag);
            addEvent(document, 'keydown', moveByKey);

            function saveParams() {
                document.frm_edit.submit();
            }

        </script>

    </head>
    <body>
        <form name="frm_edit" action="ridimensionataglia" method="post" style="margin:0px;">
            <input type="hidden" name="image" value="<% out.println(request.getParameter("image")); %>" />
            <table cellpadding="4" cellspacing="0" border="0" class="txt" width="100%">
                <tr>
                    <td colspan="5" height="24" bgcolor="#DEDEDE"><b>ridimensiona</b></td>
                </tr>
                <tr>
                    <td colspan="2" bgcolor="#EEEEEE">
                        <table cellpadding="0" cellspacing="0" class="txt">
                            <tr>
                                <td><div>percentuale</div></td>
                                <td><div style="width:198px; height:14px; background:url(images/bg_track.gif) no-repeat left top;"><div id="cursorResize" style="width:8px; height:14px; background:url(images/track.gif) no-repeat left top; cursor:pointer; position:relative;" onMouseDown="setActiveResize(event)"></div></div></td>
                                <td width="60"><div id="percent">&nbsp;(50 %)</div></td>
                            </tr>
                        </table>
                    </td>
                    <td bgcolor="#EEEEEE">larghezza <input type="text" id="input_w_r" name="input_w_r" value="" class="input" /></td>
                    <td bgcolor="#EEEEEE">altezza<input type="text" id="input_h_r" name="input_h_r" value="" class="input" /></td>
                    <td bgcolor="#EEEEEE" align="right"><input type="button" value="seleziona" onClick="setInputResize()" class="input" /></td>
                </tr>
                <tr><td height="12"></td></tr>
                <tr>
                    <td colspan="5" height="24" bgcolor="#DEDEDE"><b>taglia</b></td>
                </tr>
                <tr>
                    <td width="22%" bgcolor="#EEEEEE">x<input type="text" id="input_x" name="input_x" value="" class="input" /></td>
                    <td width="22%" bgcolor="#EEEEEE">y<input type="text" id="input_y" name="input_y" value="" class="input" /></td>
                    <td width="22%" bgcolor="#EEEEEE">larghezza<input type="text" id="input_w" name="input_w" value="" class="input" /></td>
                    <td width="22%" bgcolor="#EEEEEE">altezza<input type="text" id="input_h" name="input_h" value="" class="input" /></td>
                    <td bgcolor="#EEEEEE" align="right"><input type="button" value="seleziona" onClick="setInputCrop()" class="input" /></td>
                </tr>
                <tr><td height="12"></td></tr>
                <tr>
                    <td colspan="3" align="right" bgcolor="#DEDEDE">
                        <input type="button" value="reset" onClick="self.location.reload()" class="input" />
                        <input type="button" value="invia" onClick="saveParams()" class="input" />
                    </td>
                </tr>
            </table>
        </form>
        <br /><br />
        <div align="center">
            <div id="imgContainer" style="margin:0px;left:0px;top:0px; position:relative;"><%="<img src=\""+tmp+"\" border=\"0\" />"%></div>
        </div>
        <br /><br /><br />
    </body>
</html>