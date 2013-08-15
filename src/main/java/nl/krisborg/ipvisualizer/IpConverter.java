package nl.krisborg.ipvisualizer;

import net.firefang.ip2c.Country;
import net.firefang.ip2c.IP2Country;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * User: Kris
 * Since: 9-8-13 15:06
 */
@Controller
public class IpConverter {

    private IP2Country ip2c;

    public IpConverter() throws IOException {
        ip2c = new IP2Country("C:\\projects\\ipvisualizer\\ipvisualizer\\src\\main\\resources\\ip-to-country.bin", IP2Country.MEMORY_CACHE);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/convert/{ip}/")
    protected @ResponseBody String convertIp(@PathVariable final String ip) throws Exception {
        final Country c = ip2c.getCountry(ip);
        if (c == null) {
            return null;
        } else {
            return c.getName();
        }
    }
}
